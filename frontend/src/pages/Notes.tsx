import { useEffect, useState, type FormEvent } from "react";

type NoteCategory = "personal" | "work" | "study" | "idea";
type NoteFilter = "all" | "pinned" | NoteCategory;

type Note = {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  isPinned: boolean;
  createdAt: string;
};

function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("smartlife_notes");

    if (savedNotes) {
      return JSON.parse(savedNotes);
    }

    return [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoteCategory>("personal");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<NoteFilter>("all");

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("smartlife_notes", JSON.stringify(notes));
  }, [notes]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    if (editingNoteId) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
                category,
              }
            : note,
        ),
      );

      setEditingNoteId(null);
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        category,
        isPinned: false,
        createdAt: new Date().toISOString(),
      };

      setNotes((prevNotes) => [newNote, ...prevNotes]);
    }

    setTitle("");
    setContent("");
    setCategory("personal");
  }

  function handleDelete(noteId: string) {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  }

  function handleTogglePin(noteId: string) {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              isPinned: !note.isPinned,
            }
          : note,
      ),
    );
  }

  function handleEdit(note: Note) {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
  }

  function handleCancelEdit() {
    setEditingNoteId(null);
    setTitle("");
    setContent("");
    setCategory("personal");
  }

  const totalNotes = notes.length;
  const pinnedNotes = notes.filter((note) => note.isPinned).length;
  const studyNotes = notes.filter((note) => note.category === "study").length;

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "pinned" && note.isPinned) ||
        note.category === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

  function getCategoryClass(category: NoteCategory) {
    if (category === "study") {
      return "bg-blue-400/10 text-blue-300";
    }

    if (category === "work") {
      return "bg-purple-400/10 text-purple-300";
    }

    if (category === "idea") {
      return "bg-yellow-400/10 text-yellow-300";
    }

    return "bg-teal-400/10 text-teal-300";
  }

  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold text-white">Notes</h1>
        <p className="mt-2 text-slate-400">
          Save ideas, study notes, reminders, and personal thoughts.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Notes</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{totalNotes}</h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Pinned Notes</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-300">
            {pinnedNotes}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Study Notes</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-300">
            {studyNotes}
          </h2>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-xl font-semibold text-white">
          {editingNoteId ? "Edit Note" : "Add New Note"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-32 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as NoteCategory)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="idea">Idea</option>
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-teal-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-teal-300"
            >
              {editingNoteId ? "Update Note" : "Add Note"}
            </button>

            {editingNoteId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg border border-slate-700 px-4 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Note List</h2>
            <p className="mt-1 text-sm text-slate-400">
              Search, filter, pin, edit, or delete your notes.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-teal-400"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as NoteFilter)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-teal-400"
            >
              <option value="all">All Notes</option>
              <option value="pinned">Pinned</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="idea">Idea</option>
            </select>
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <p className="mt-6 text-slate-400">No notes found.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-white">
                      {note.isPinned ? "📌 " : ""}
                      {note.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {note.content}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryClass(
                          note.category,
                        )}`}
                      >
                        {note.category}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    className="rounded-lg border border-yellow-500/30 px-3 py-1 text-sm text-yellow-300 transition hover:bg-yellow-500/10"
                  >
                    {note.isPinned ? "Unpin" : "Pin"}
                  </button>

                  <button
                    onClick={() => handleEdit(note)}
                    className="rounded-lg border border-slate-500/30 px-3 py-1 text-sm text-slate-300 transition hover:bg-slate-700/40"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(note.id)}
                    className="rounded-lg border border-red-500/30 px-3 py-1 text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Notes;
