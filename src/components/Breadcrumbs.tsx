import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@src/components/ui/breadcrumb";

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
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {urls.map((url, index) => (
          <Fragment key={url[1]}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink href={url[1]}>{url[0]}</BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
