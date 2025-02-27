import ResetPasswordForm from "@/components/resetPasswordForm/ResetPasswordForm";

export default function Page({ searchParams }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm  searchParams={searchParams}/>
    </div>
  );
}
