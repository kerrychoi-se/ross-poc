import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-jasper-white flex items-center justify-center px-6">
      <div className="jasper-card max-w-md w-full text-center">
        <h2 className="font-display text-2xl font-bold text-jasper-navy mb-4">
          Page Not Found
        </h2>
        <p className="text-jasper-gray mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/" className="btn-jasper-primary inline-block">
          Go back home
        </Link>
      </div>
    </div>
  );
}
