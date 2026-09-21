import { useEffect, useState, type FormEvent } from "react";

type ExpenseCategory =
  | "food"
  | "transport"
  | "rent"
  | "shopping"
  | "study"
  | "other";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
};

function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem("smartlife_expenses");

    if (savedExpenses) {
      return JSON.parse(savedExpenses);
    }

    return [];
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [date, setDate] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ExpenseCategory>(
    "all",
  );

  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("smartlife_expenses", JSON.stringify(expenses));
  }, [expenses]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !amount || !date) {
      return;
    }

    if (editingExpenseId) {
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === editingExpenseId
            ? {
                ...expense,
                title: title.trim(),
                amount: Number(amount),
                category,
                date,
              }
            : expense,
        ),
      );

      setEditingExpenseId(null);
    } else {
      const newExpense: Expense = {
        id: crypto.randomUUID(),
        title: title.trim(),
        amount: Number(amount),
        category,
        date,
      };

      setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
    }

    setTitle("");
    setAmount("");
    setCategory("food");
    setDate("");
  }

  function handleDelete(expenseId: string) {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== expenseId),
    );
  }

  function handleEdit(expense: Expense) {
    setEditingExpenseId(expense.id);
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(expense.date);
  }

  function handleCancelEdit() {
    setEditingExpenseId(null);
    setTitle("");
    setAmount("");
    setCategory("food");
    setDate("");
  }

  const totalExpense = expenses.reduce((total, expense) => {
    return total + expense.amount;
  }, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExpense = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((total, expense) => total + expense.amount, 0);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold text-white">Expenses</h1>
        <p className="mt-2 text-slate-400">
          Track your daily spending and understand where your money goes.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Expenses</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            ${totalExpense.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">This Month</p>
          <h2 className="mt-2 text-3xl font-bold text-teal-300">
            ${thisMonthExpense.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Records</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {expenses.length}
          </h2>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-xl font-semibold text-white">
          {editingExpenseId ? "Edit Expense" : "Add New Expense"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Expense title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as ExpenseCategory)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          >
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="rent">Rent</option>
            <option value="shopping">Shopping</option>
            <option value="study">Study</option>
            <option value="other">Other</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
          />

          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-teal-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-teal-300"
            >
              {editingExpenseId ? "Update Expense" : "Add Expense"}
            </button>

            {editingExpenseId && (
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
            <h2 className="text-xl font-semibold text-white">Expense List</h2>
            <p className="mt-1 text-sm text-slate-400">
              Search, filter, edit, or delete your expenses.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-teal-400"
            />

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value as "all" | ExpenseCategory)
              }
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-teal-400"
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="rent">Rent</option>
              <option value="shopping">Shopping</option>
              <option value="study">Study</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <p className="mt-6 text-slate-400">No expenses found.</p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-medium text-white">{expense.title}</h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-300">
                        ${expense.amount.toFixed(2)}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        {expense.category}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="rounded-lg border border-slate-500/30 px-3 py-1 text-sm text-slate-300 transition hover:bg-slate-700/40"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="rounded-lg border border-red-500/30 px-3 py-1 text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Expenses;
