import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPayments() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/settings?tab=payment", { replace: true });
  }, [navigate]);

  return null;
}
