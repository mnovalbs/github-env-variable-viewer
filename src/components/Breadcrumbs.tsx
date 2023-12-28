interface BreadcrumbsProps {
  names: string[];
}

function Breadcrumbs({ names }: Readonly<BreadcrumbsProps>) {
  const urls = names.reduce((prev, name, index) => {
    const newArr = [...prev];
    const prevUrl = newArr[index][1];
    newArr.push([name, `${prevUrl}${name}/`]);

    return newArr;
  }, [['All Organization', '/']]);

  return (
    <div className="text-xs breadcrumbs">
      <ul>
        {urls.map((url) => (
          <li key={url[0]}>
            <a href={url[1]}>{url[0]}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Breadcrumbs;
