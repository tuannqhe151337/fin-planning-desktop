import { createHashRouter, RouterProvider } from "react-router-dom";

const router = createHashRouter([
  // Auth pages
  {
    path: "/auth",
    children: [
      {
        path: "login",
        lazy: async () => {
          const LoginPage = (await import("../../pages/login-page")).LoginPage;

          return {
            element: <LoginPage />,
          };
        },
      },
      {
        path: "forgot-password",
        lazy: async () => {
          const ForgotPasswordPage = (
            await import("../../pages/forgot-password-page")
          ).ForgotPasswordPage;
          return {
            element: <ForgotPasswordPage />,
          };
        },
      },
      {
        path: "otp",
        lazy: async () => {
          const OtpPage = (await import("../../pages/otp-page")).OtpPage;
          return {
            element: <OtpPage />,
          };
        },
      },
      {
        path: "reset-password",
        lazy: async () => {
          const ResetPasswordPage = (
            await import("../../pages/reset-password-page")
          ).ResetPasswordPage;
          return {
            element: <ResetPasswordPage />,
          };
        },
      },
    ],
  },

  // Protected pages
  {
    path: "/",
    lazy: async () => {
      const ProtectedRootPage = (
        await import("../../pages/protected-root-page")
      ).ProtectedRootPage;

      return {
        element: <ProtectedRootPage />,
      };
    },
    children: [
      // Home page
      {
        path: "",
        lazy: async () => {
          const HomePage = (await import("../../pages/home-page")).HomePage;

          return {
            element: <HomePage />,
          };
        },
      },

      // Plan management pages
      {
        path: "plan-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const PlanManagementListPage = (
                await import("../../pages/plan-management-list")
              ).PlanManagementList;

              return {
                element: <PlanManagementListPage />,
              };
            },
          },
          {
            path: "detail",
            lazy: async () => {
              const PlanDetailRootPage = (
                await import("../../pages/plan-detail-root-page")
              ).PlanDetailRootPage;

              return {
                element: <PlanDetailRootPage />,
              };
            },
            children: [
              {
                path: "expenses/:planId",
                lazy: async () => {
                  const PlanDetailExpensePage = (
                    await import("../../pages/plan-detail-expense-page")
                  ).PlanDetailExpensePage;

                  return {
                    element: <PlanDetailExpensePage />,
                  };
                },
              },
              {
                path: "information/:planId",
                lazy: async () => {
                  const PlanDetailInformationPage = (
                    await import("../../pages/plan-detail-information-page")
                  ).PlanDetailInformationPage;

                  return {
                    element: <PlanDetailInformationPage />,
                  };
                },
              },
              {
                path: "version/:planId",
                lazy: async () => {
                  const PlanDetailVersionPage = (
                    await import("../../pages/plan-detail-version-page")
                  ).PlanDetailVersionPage;

                  return {
                    element: <PlanDetailVersionPage />,
                  };
                },
              },
            ],
          },
        ],
      },

      // User management pages
      {
        path: "user-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const UserManagementListPage = (
                await import("../../pages/user-management-list")
              ).UserManagementList;

              return {
                element: <UserManagementListPage />,
              };
            },
          },

          {
            path: "detail/:userId",
            lazy: async () => {
              const UserDetailPage = (
                await import("../../pages/user-detail-page")
              ).UserDetail;

              return {
                element: <UserDetailPage />,
              };
            },
          },

          {
            path: "create",
            lazy: async () => {
              const UserCreate = (await import("../../pages/user-create-page"))
                .UserCreate;

              return {
                element: <UserCreate />,
              };
            },
          },

          {
            path: "edit/:userId",
            lazy: async () => {
              const UserEdit = (await import("../../pages/user-edit-page"))
                .UserEditPage;

              return {
                element: <UserEdit />,
              };
            },
          },
        ],
      },

      // Profile pages
      {
        path: "profile",
        children: [
          {
            path: "",
            lazy: async () => {
              const ProfilePage = (await import("../../pages/profile")).Profile;
              return {
                element: <ProfilePage />,
              };
            },
          },
          {
            path: "change-password/:planId",
            lazy: async () => {
              const ChangePasswordPage = (
                await import("../../pages/change-password-page")
              ).ChangePasswordPage;
              return {
                element: <ChangePasswordPage />,
              };
            },
          },
        ],
      },

      // Term management pages
      {
        path: "term-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const TermManagementListPage = (
                await import("../../pages/term-management-list")
              ).TermManagementList;

              return {
                element: <TermManagementListPage />,
              };
            },
          },

          {
            path: "update/:termId",
            lazy: async () => {
              const TermUpdatePage = (
                await import("../../pages/term-update-page")
              ).TermUpdate;

              return {
                element: <TermUpdatePage />,
              };
            },
          },

          {
            path: "detail",
            lazy: async () => {
              const TermDetailRootPage = (
                await import("../../pages/term-detail-root-page")
              ).TermDetailRootPage;

              return {
                element: <TermDetailRootPage />,
              };
            },

            children: [
              {
                path: "information/:termId",
                lazy: async () => {
                  const TermDetailInformationPage = (
                    await import("../../pages/term-detail-information-page")
                  ).TermDetailInformationPage;

                  return {
                    element: <TermDetailInformationPage />,
                  };
                },
              },
              {
                path: "plan/:termId",
                lazy: async () => {
                  const TermDetailPlanPage = (
                    await import("../../pages/term-detail-plan-page")
                  ).TermDetailPlanPage;

                  return {
                    element: <TermDetailPlanPage />,
                  };
                },
              },
              {
                path: "report/:termId",
                lazy: async () => {
                  const TermDetailReportPage = (
                    await import("../../pages/term-detail-report-page")
                  ).TermDetailReportPage;

                  return {
                    element: <TermDetailReportPage />,
                  };
                },
              },
            ],
          },
        ],
      },

      // Financial Report pages
      {
        path: "report-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const ReportManagementListPage = (
                await import("../../pages/report-management-page")
              ).ReportManagementList;

              return {
                element: <ReportManagementListPage />,
              };
            },
          },
          {
            path: "detail",
            lazy: async () => {
              const ReportDetailRootPage = (
                await import("../../pages/report-detail-root-page")
              ).ReportDetailRootPage;

              return {
                element: <ReportDetailRootPage />,
              };
            },
            children: [
              {
                path: "expenses/:reportId",
                lazy: async () => {
                  const ReportDetailExpensePage = (
                    await import("../../pages/report-detail-expense-page")
                  ).ReportDetailExpensePage;

                  return {
                    element: <ReportDetailExpensePage />,
                  };
                },
              },
              {
                path: "information/:reportId",
                lazy: async () => {
                  const ReportDetailInformationPage = (
                    await import("../../pages/report-detail-information-page")
                  ).ReportDetailInformationPage;

                  return {
                    element: <ReportDetailInformationPage />,
                  };
                },
              },
            ],
          },
        ],
      },

      // Financial Report pages
      {
        path: "annual-report",
        children: [
          {
            path: "",
            lazy: async () => {
              const AnnualReportListPage = (
                await import("../../pages/annual-report-page")
              ).AnnualReportList;

              return {
                element: <AnnualReportListPage />,
              };
            },
          },

          {
            path: "detail",
            lazy: async () => {
              const AnnualReportDetailRootPage = (
                await import("../../pages/annual-report-detail-root-page")
              ).AnnualReportDetailRootPage;

              return {
                element: <AnnualReportDetailRootPage />,
              };
            },
            children: [
              {
                path: "chart/:year",
                lazy: async () => {
                  const AnnualReportDetailChartPage = (
                    await import("../../pages/annual-report-detail-chart-page")
                  ).AnnualReportDetailChartPage;

                  return {
                    element: <AnnualReportDetailChartPage />,
                  };
                },
              },
              {
                path: "table/:year",
                lazy: async () => {
                  const AnnualReportDetailTablePage = (
                    await import("../../pages/annual-report-detail-table-page")
                  ).AnnualReportDetailTablePage;

                  return {
                    element: <AnnualReportDetailTablePage />,
                  };
                },
              },
            ],
          },
        ],
      },

      // List department pages
      {
        path: "department-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const DepartmentManagementListPage = (
                await import("../../pages/department-management-list")
              ).DepartmentManagementList;

              return {
                element: <DepartmentManagementListPage />,
              };
            },
          },
        ],
      },

      // List cost type pages
      {
        path: "cost-type-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const CostTypeManagementListPage = (
                await import("../../pages/cost-type-management-list")
              ).CostTypeManagementList;

              return {
                element: <CostTypeManagementListPage />,
              };
            },
          },
        ],
      },

      // List position pages
      {
        path: "position-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const PositionManagementListPage = (
                await import("../../pages/position-management-list")
              ).PositionManagementList;

              return {
                element: <PositionManagementListPage />,
              };
            },
          },
        ],
      },

      // List project pages
      {
        path: "project-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const ProjectManagementListPage = (
                await import("../../pages/project-management-list")
              ).ProjectManagementList;

              return {
                element: <ProjectManagementListPage />,
              };
            },
          },
        ],
      },

      // List supplier pages
      {
        path: "supplier-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const SupplierManagementListPage = (
                await import("../../pages/supplier-management-list")
              ).SupplierManagementList;

              return {
                element: <SupplierManagementListPage />,
              };
            },
          },
        ],
      },

      // Exchange rate pages
      {
        path: "exchange-rate",
        lazy: async () => {
          const ExchangeRateRootPage = (
            await import("../../pages/exchange-rate-root-page")
          ).ExchangeRateRootPage;

          return {
            element: <ExchangeRateRootPage />,
          };
        },
        children: [
          {
            path: "",
            lazy: async () => {
              const ExchangeRateManagementList = (
                await import(
                  "../../pages/monthly-exchange-rate-management-list"
                )
              ).ExchangeRateManagementList;

              return {
                element: <ExchangeRateManagementList />,
              };
            },
          },
          {
            path: "currency",
            lazy: async () => {
              const CurrencyManagementListPage = (
                await import("../../pages/currency-management-list-page")
              ).CurrencyManagementListPage;

              return {
                element: <CurrencyManagementListPage />,
              };
            },
          },
        ],
      },
    ],
  },
]);

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};
