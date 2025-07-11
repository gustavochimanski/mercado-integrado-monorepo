// packages/ui/src/MonoComponentBotao.tsx
"use client"
type Props = {
  children: React.ReactNode;
};

export const MeuBotao = ({ children }: Props) => {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      {children}
      <div className="text-black">osdaoisjiasnasd</div>
    </button>
  );
};
