type StateCardProps = {
  title: string;
  value: string | number;
};

function StateCard({ title, value }: StateCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <h2 className="mt-2 text-3xl font-bold text-white">{value}</h2>
    </div>
  );
}
export default StateCard;
