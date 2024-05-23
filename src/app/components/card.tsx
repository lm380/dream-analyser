export function Card({
  title,
  value,
}: //   type,
{
  title: string;
  value: number | string;
  //   type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  //   const Icon = iconMap[type];

  return (
    <div className="rounded-xl p-2 shadow-sm max-h-72 overflow-auto ">
      {/* {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null} */}
      <h3 className="ml-2 text-sm font-medium">{title}</h3>
      <p className={`rounded px-4 py-8 text-center`}>{value}</p>
    </div>
  );
}

export function ListCard({
  title,
  value,
}: //   type,
{
  title: string;
  value: string[];
  //   type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  //   const Icon = iconMap[type];

  return (
    <div className="rounded-xl p-2 shadow-sm max-h-72 overflow-auto ">
      {/* {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null} */}
      <h3 className="ml-2 text-sm font-medium">{title}</h3>

      <ol className={`rounded px-4 py-8`}>
        {[...value].map((element, index) => (
          <li key={index}>{element}</li>
        ))}
      </ol>
    </div>
  );
}
