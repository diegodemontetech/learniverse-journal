import { Building2, UserRoundCog } from "lucide-react";

interface ProfileInfoProps {
  profile: any;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold text-white mb-2">
        {profile?.first_name} {profile?.last_name}
      </h1>
      
      <div className="space-y-2 text-gray-400">
        {profile?.positions?.name && (
          <div className="flex items-center gap-2">
            <UserRoundCog className="w-4 h-4" />
            <span>{profile.positions.name}</span>
          </div>
        )}
        {profile?.departments?.name && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>{profile.departments.name}</span>
          </div>
        )}
        {profile?.reports_to && (
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-gray-500">Reports to:</span>
            <span>
              {profile.reports_to.first_name} {profile.reports_to.last_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;