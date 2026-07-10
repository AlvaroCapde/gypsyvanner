import DocumentViewer from "@/components/DocumentViewer";

export default function CertificateOfBreedingPage() {
  return (
    <DocumentViewer title="Certificate of Breeding" filename="certificate_of_breeding.pdf">
      <p>The Certificate of Breeding is a mandatory document to register a foal if the sire is not owned by the applicant at the time of breeding.</p>
      
      <h3>Instructions</h3>
      <ol>
        <li>The owner of the stallion must fill out this form at the time of service.</li>
        <li>Ensure all dates of exposure are accurately recorded.</li>
        <li>The signature of the stallion owner must be original.</li>
      </ol>

      <h3>Required Information</h3>
      <ul>
        <li>Stallion's Registered Name and GVHS Registration Number.</li>
        <li>Mare's Registered Name and GVHS Registration Number.</li>
        <li>Dates of natural cover or artificial insemination.</li>
      </ul>

      <p className="text-sm text-zinc-500 mt-12 italic text-center">
        -- Please replace this placeholder text with the actual content from the official Certificate of Breeding PDF --
      </p>
    </DocumentViewer>
  );
}
