import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import PageStatus from "../components/PageStatus";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <PageHeader
        eyebrow="404"
        title="Page not found"
        description="The address may be incorrect, or the page may have moved."
        className="mb-6"
      />

      <PageStatus
        kind="empty"
        title="Choose another path"
        message="Return home or continue with the English learning sections."
        actions={[
          {
            label: "Go to Home",
            onClick: () => navigate("/"),
            variant: "primary",
          },
          {
            label: "Browse Grammar",
            onClick: () => navigate("/grammar"),
          },
        ]}
      />
    </PageShell>
  );
}
