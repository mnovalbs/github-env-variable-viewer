import type { EnvironmentVariable } from "@src/types/github";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@src/components/ui/accordion";
import { Alert, AlertDescription } from "@src/components/ui/alert";
import { Button } from "@src/components/ui/button";
import { Card } from "@src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog";
import VariableForm from "./VariableForm";

interface VariableListProps {
  variables: EnvironmentVariable[];
  envName: string
}

function VariableList({ variables, envName }: Readonly<VariableListProps>) {
  const isProd = envName.toLowerCase().startsWith('prod')

  return (
    <div className="flex flex-col gap-4 max-h-full">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Environment Variables</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" disabled={isProd}>
              Add New Variable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Variable</DialogTitle>
            </DialogHeader>
            <form method="POST">
              <VariableForm variable={{ name: "", value: "" }} disabled={isProd} />
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!variables.length ? (
        <Alert>
          <AlertDescription>No Data Found</AlertDescription>
        </Alert>
      ) : (
        <Card className="py-0 px-4">
          <Accordion type="single" collapsible>
            {variables.map((variable) => (
              <AccordionItem key={variable.name} value={variable.name}>
                <AccordionTrigger>{variable.name}</AccordionTrigger>
                <AccordionContent>
                  <form method="POST">
                    <input type="hidden" name="name" value={variable.name} />
                    <VariableForm variable={variable} disabled={isProd} />
                  </form>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      )}
    </div>
  );
}

export default VariableList;
