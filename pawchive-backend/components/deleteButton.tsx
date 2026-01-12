'use client';

import { useTransition } from 'react';

type Props = {
  id: string;
  name: string;
  action: (formData: FormData) => void;
};

export default function DeleteButton({ id, name, action }: Props) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    const formData = new FormData();
    formData.append('id', id);

    startTransition(() => {
      action(formData);
    });
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
