import { ExtendedUser } from "../../next-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}
const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className=" w-full max-w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
          <p className="text-sm font-medium">ID</p>
          <p className="p-1 font-mono text-xs truncate rounded-md opacity-75 bg-accent">
            {user?.id}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p className="p-1 font-mono text-xs truncate rounded-md opacity-75 bg-accent">
            {user?.name}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p className="p-1 font-mono text-xs truncate rounded-md opacity-75 bg-accent">
            {user?.email}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p className="p-1 font-mono text-xs truncate rounded-md opacity-75 bg-accent">
            {user?.role}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>

          <Badge
            variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
            className="p-1 font-mono text-xs truncate rounded-md"
          >
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
