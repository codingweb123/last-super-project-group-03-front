/* app/(public routes)/goods/[id]/error.tsx */



'use client';

export default function Error({
  reset,
}: {
  error?: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Товар не знайдено</h2>
      <p>На жаль, цей товар більше не доступний</p>
      <button onClick={() => reset()}>Спробувати знову</button>
    </div>
  );
}



