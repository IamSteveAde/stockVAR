import NewEntryForm from "../../components/entry/NewEntryForm";

export default function NewEntryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-[#111827]">New Stock Entry</h1>
      <NewEntryForm />
    </div>
  );
}