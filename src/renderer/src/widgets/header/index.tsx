import { Link } from "react-router-dom";
import { DarkmodeChanger } from "../../features/darkmode-changer";
import { LanguageChanger } from "../../features/language-changer";
import { ThemeChanger } from "../../features/theme-changer";
import { AccountIcon } from "../../entities/account-icon";
import { UserGuide } from "../user-guide";

interface Props {
  onLogoutClick?: Function;
}

export const Header: React.FC<Props> = ({ onLogoutClick }) => {
  return (
    <div className="flex items-center h-[100px]">
      <div className="ml-10">
        <Link to={`/`}>
          <p className="text-primary">
            <span className="text-4xl font-black">F</span>
            <span className="text-3xl font-extrabold">in</span>
            <span className="text-4xl font-black">P</span>
            <span className="text-3xl font-extrabold">lanning</span>
          </p>
        </Link>
      </div>
      <div className="flex items-center ml-auto mr-10">
        <LanguageChanger />
        <UserGuide />
        <ThemeChanger />
        <DarkmodeChanger />

        <AccountIcon onLogoutClick={onLogoutClick} />
      </div>
    </div>
  );
};
