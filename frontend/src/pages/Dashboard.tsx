import StateCard from "../components/StateCard";

function Dashboard() {
  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-400">
          Welcome back. Here is your SmartLife overview.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StateCard title="Total Tasks" value={0} />
        <StateCard title="Total Expenses" value="$0" />
        <StateCard title="Notes" value={0} />
      </div>
    </section>
  );
}

export default Dashboard;
