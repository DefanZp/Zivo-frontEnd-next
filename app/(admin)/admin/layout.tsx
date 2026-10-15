import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminGuard } from "@/components/auth/admin-guard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <AdminNavigation>{children}</AdminNavigation>
        </AdminGuard>
    );
}