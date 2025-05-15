import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Trash } from 'lucide-react';
import { useState } from 'react';

interface AlertDeleteDialogProps {
  element: string;
  handleDelete: (uuid: string) => void;
  elementUuid: string;
}

const AlertDeleteDialog = ({
  element,
  handleDelete,
  elementUuid,
}: AlertDeleteDialogProps) => {
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] =
    useState<boolean>(false);

  return (
    <AlertDialog
      open={openAlertDeleteDialog}
      onOpenChange={setOpenAlertDeleteDialog}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant='outline' size='sm'>
              <Trash className='text-primary' />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Excluir {element}</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja excluir o {element}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação irá excluir o {element} permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleDelete(elementUuid);
              setOpenAlertDeleteDialog(false);
            }}
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDeleteDialog;
