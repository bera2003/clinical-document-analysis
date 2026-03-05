export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      
      <div className="text-4xl animate-pulse">
        🧠
      </div>

      <p className="text-lg font-medium">
        Extracting Medical Entities...
      </p>

    </div>
  );
}