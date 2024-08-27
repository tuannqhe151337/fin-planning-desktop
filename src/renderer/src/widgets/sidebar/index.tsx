import { Link, useLocation } from "react-router-dom";
import { ResizableBox } from "react-resizable";
import { MdDashboard } from "react-icons/md";
import { FaTruck, FaUserGroup } from "react-icons/fa6";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { HiDocumentReport } from "react-icons/hi";
import {
  FaChartPie,
  FaChartLine,
  FaBars,
  FaCoins,
  FaProjectDiagram,
} from "react-icons/fa";
import { Tab } from "./ui/tab";
import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { IconButton } from "../../shared/icon-button";
import { useMeQuery } from "../../providers/store/api/authApi";
import { Role } from "../../providers/store/api/type";
import { HiOfficeBuilding } from "react-icons/hi";
import { PiOfficeChairFill } from "react-icons/pi";
import { CurrencyConversionIcon } from "../../shared/icons/currency-conversion-icon";

interface Props {
  onWidthChange?: (width: number) => any;
}

export const Sidebar: React.FC<Props> = ({ onWidthChange }) => {
  // i18n
  const { t } = useTranslation(["sidebar"]);

  // Router
  const location = useLocation();

  // Get me's data
  const { data } = useMeQuery();

  // Width state
  const [width, setWidth] = useState<number>(250);

  // Expanded or close state
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  useHotkeys("ctrl + b", () => {
    setIsExpanded((prevState) => !prevState);
  });

  useEffect(() => {
    setWidth(isExpanded ? 275 : 85);
  }, [isExpanded]);

  // Pass to outer components
  useEffect(() => {
    onWidthChange && onWidthChange(width);
  }, [width]);

  return (
    <ResizableBox
      className="pl-5 z-20"
      height={Infinity}
      width={width}
      minConstraints={[80, Infinity]}
      resizeHandles={["e"]}
      onResize={(event, data) => {
        setWidth(data.size.width);
        event.preventDefault();
      }}
    >
      <div>
        {/* Toggle open close */}
        <div className="pl-3 mb-3">
          <IconButton
            tooltip="Toggle sidebar (Ctrl + B)"
            onClick={() => setIsExpanded((prevState) => !prevState)}
          >
            <FaBars className="text-xl text-primary-500" />
          </IconButton>
        </div>

        <div className="w-full border-t-2 dark:border-t-neutral-800 mb-5"></div>

        {/* Home */}
        <div>
          <Link to={`/`}>
            <Tab
              icon={<MdDashboard className="text-2xl" />}
              text={t("Home")}
              selected={location.pathname === "/"}
              isExpanded={isExpanded}
            />
          </Link>
        </div>

        {/* Annual report */}
        {data?.role.code === Role.ACCOUNTANT && (
          <div>
            <Link to={`/annual-report`}>
              <Tab
                icon={<FaChartPie className="text-2xl" />}
                text={t("Annual Report")}
                selected={location.pathname.startsWith("/annual-report")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* Term management */}
        {data?.role.code === Role.ACCOUNTANT && (
          <div>
            <Link to={`/term-management`}>
              <Tab
                icon={
                  <RiCalendarScheduleFill className="text-2xl -ml-0.5 mr-0.5" />
                }
                text={t("Term management")}
                selected={location.pathname.startsWith("/term-management")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* Financial report */}
        {data?.role.code === Role.ACCOUNTANT && (
          <div>
            <Link to={`/report-management`}>
              <Tab
                icon={<HiDocumentReport className="text-3xl -ml-1 -mr-0.5" />}
                text={t("Financial report")}
                selected={location.pathname.startsWith("/report-management")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* Financial plan */}
        {(data?.role.code === Role.ACCOUNTANT ||
          data?.role.code === Role.FINANCIAL_STAFF) && (
          <div>
            <Link to={`/plan-management`}>
              <Tab
                icon={<FaChartLine className="text-2xl" />}
                text={t("Financial plan")}
                selected={location.pathname.startsWith("/plan-management")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* User management */}
        {data?.role.code === Role.ADMIN && (
          <div>
            <Link to={`/user-management`}>
              <Tab
                icon={<FaUserGroup className="text-2xl -ml-0.5" />}
                text={t("User management")}
                selected={location.pathname.startsWith("/user-management")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* Department management */}
        {data?.role.code === Role.ADMIN && (
          <div>
            <Link to={`/department-management`}>
              <Tab
                icon={<HiOfficeBuilding className="text-2xl -ml-0.5" />}
                text={t("Department")}
                selected={location.pathname.startsWith(
                  "/department-management",
                )}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* Exchange reate */}
        {data?.role.code === Role.ACCOUNTANT && (
          <div>
            <Link to={`/exchange-rate`}>
              <Tab
                icon={
                  <CurrencyConversionIcon className="w-[27px] fill-primary-500 -mr-[3px] -mt-1 -mb-2" />
                }
                text={t("Exchange rate")}
                selected={location.pathname.startsWith("/exchange-rate")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* Masterdata divider */}
        {data?.role.code === Role.ACCOUNTANT ? (
          isExpanded ? (
            <div className="mt-3 mb-2 pl-4 text-sm font-bold text-neutral-400">
              Masterdata
            </div>
          ) : (
            <div className="w-full border-t-2 dark:border-t-neutral-800 mt-3 mb-2"></div>
          )
        ) : null}

        {/* Position management */}
        {data?.role.code === Role.ADMIN && (
          <div>
            <Link to={`/position-management`}>
              <Tab
                icon={<PiOfficeChairFill className="text-2xl" />}
                text={t("Position")}
                selected={location.pathname.startsWith("/position-management")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* Cost type management */}
        {data?.role.code === Role.ACCOUNTANT && (
          <div>
            <Link to={`/cost-type-management`}>
              <Tab
                icon={<FaCoins className="text-2xl" />}
                text={t("Cost type")}
                selected={location.pathname.startsWith("/cost-type-management")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* Supplier management */}
        {data?.role.code === Role.ACCOUNTANT && (
          <div>
            <Link to={`/supplier-management`}>
              <Tab
                icon={<FaTruck className="text-2xl" />}
                text={t("Supplier")}
                selected={location.pathname.startsWith("/supplier-management")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}

        {/* Project management */}
        {data?.role.code === Role.ACCOUNTANT && (
          <div>
            <Link to={`/project-management`}>
              <Tab
                icon={<FaProjectDiagram className="text-2xl" />}
                text={t("Project")}
                selected={location.pathname.startsWith("/project-management")}
                isExpanded={isExpanded}
              />
            </Link>
          </div>
        )}
      </div>
    </ResizableBox>
  );
};
