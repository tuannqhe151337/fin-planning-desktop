import { Link } from "react-router-dom";

interface Props {
  to?: string;
}

export const LogoRedirect: React.FC<Props> = ({ to = "/" }) => {
  return (
    <div className="text-primary-500 ml-16 p-6">
      <Link to={to}>
        <p className="text-primary">
          <span className="text-4xl font-black">F</span>
          <span className="text-3xl font-extrabold">in</span>
          <span className="text-4xl font-black">P</span>
          <span className="text-3xl font-extrabold">lanning</span>
        </p>
      </Link>
    </div>
  );
};
