import { useEffect, useState } from "react";
import { BubbleBanner } from "../../entities/bubble-banner";
import { Button } from "../../shared/button";
import { Variants, motion } from "framer-motion";
import _ from "lodash";
import { Row, TableProject } from "../../widgets/table-project";
import { SearchBox } from "../../shared/search-box";
import { FaPlusCircle } from "react-icons/fa";
import {
  Project,
  ListProjectParameters,
  useLazyGetListProjectQuery,
  projectAPI,
} from "../../providers/store/api/projectsApi";
import { DeleteProjectModal } from "../../widgets/delete-project-modal";
import { ProjectCreateModal } from "../../widgets/project-create-modal";
import { ProjectEditModal } from "../../widgets/project-edit-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { useDispatch } from "react-redux";

const generateEmptyProjects = (total: number): Project[] => {
  const projects: Row[] = [];

  for (let i = 0; i < total; i++) {
    projects.push({
      projectId: 0,
      name: "",
      createdAt: "",
      updatedAt: "",
      isFetching: true,
    });
  }

  return projects;
};

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
};

const childrenAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const ProjectManagementList: React.FC = () => {
  // Query
  const [fetchProjects, { data, isFetching }] = useLazyGetListProjectQuery();

  // Scroll to top
  useScrollToTopOnLoad();

  // Clear previous cache
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(projectAPI.util.resetApiState());
  }, []);

  // Searchbox state
  const [searchboxValue, setSearchboxValue] = useState<string>("");

  const [page, setPage] = useState<number>(1);

  // Is data empty (derived from data)
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>();

  useEffect(() => {
    setIsDataEmpty(!isFetching && data && data.data && data.data.length === 0);
  }, [data]);

  // Fetch plan on change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const paramters: ListProjectParameters = {
        query: searchboxValue,
        page,
        pageSize: 10,
      };

      fetchProjects(paramters, true);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchboxValue, page]);

  // Delete Project
  const [showDeleteProjectModal, setShowDeleteProjectModal] =
    useState<boolean>(false);

  const [chosenDeleteProject, setChosenDeleteProject] = useState<Project>();

  // Edit Project
  const [showEditProjectModal, setShowEditProjectModal] =
    useState<boolean>(false);

  const [chosenEditProject, setChosenEditProject] = useState<Project>();

  // Create Project
  const [showCreateProject, setShowCreateProject] = useState<boolean>(false);

  useHotkeys("ctrl + =", (e) => {
    e.preventDefault();
    setShowCreateProject(true);
  });

  return (
    <motion.div
      className="px-6 pb-10"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      {/* Banner */}
      <BubbleBanner>
        <div className="flex flex-row flex-wrap w-full items-center mt-auto">
          <p className="text-primary dark:text-primary/70 font-extrabold text-xl w-fit ml-7">
            Project management
          </p>
          <div className="ml-auto">
            <Button
              onClick={() => {
                setShowCreateProject(true);
              }}
            >
              <div className="flex flex-row flex-wrap items-center gap-2.5">
                <FaPlusCircle className="text-xl" />
                <p className="text-sm font-semibold">New Project</p>
              </div>
            </Button>
          </div>
        </div>
      </BubbleBanner>

      <motion.div className="mt-14" variants={childrenAnimation}>
        <SearchBox
          value={searchboxValue}
          onChange={(e) => setSearchboxValue(e.currentTarget.value)}
        />
      </motion.div>

      <motion.div variants={childrenAnimation}>
        <TableProject
          onCreateProject={() => {
            setShowCreateProject(true);
          }}
          onDeleteProject={(project) => {
            setChosenDeleteProject(project);
            setShowDeleteProjectModal(true);
          }}
          onEditProject={(project) => {
            setChosenEditProject(project);
            setShowEditProjectModal(true);
          }}
          projects={isFetching ? generateEmptyProjects(10) : data?.data}
          isDataEmpty={isDataEmpty}
          page={page}
          totalPage={data?.pagination.numPages}
          onNext={() =>
            setPage((prevPage) => {
              if (data?.pagination.numPages) {
                if (prevPage + 1 > data?.pagination.numPages) {
                  return data?.pagination.numPages;
                } else {
                  return prevPage + 1;
                }
              } else {
                return 1;
              }
            })
          }
          onPageChange={(page) => {
            setPage(page || 1);
          }}
          onPrevious={() =>
            setPage((prevPage) => {
              if (data?.pagination.numPages) {
                if (prevPage === 1) {
                  return 1;
                } else {
                  return prevPage - 1;
                }
              } else {
                return 1;
              }
            })
          }
          isFetching={isFetching}
        />
      </motion.div>

      {chosenDeleteProject && (
        <DeleteProjectModal
          show={showDeleteProjectModal}
          project={chosenDeleteProject}
          onClose={() => {
            setShowDeleteProjectModal(false);
          }}
          onDeleteSuccessfully={() => {
            setShowDeleteProjectModal(false);
          }}
        />
      )}

      {chosenEditProject && (
        <ProjectEditModal
          show={showEditProjectModal}
          project={chosenEditProject}
          onClose={() => {
            setShowEditProjectModal(false);
          }}
          onUpdateSuccessfully={() => {
            setShowEditProjectModal(false);
          }}
        />
      )}

      <ProjectCreateModal
        show={showCreateProject}
        onClose={() => {
          setShowCreateProject(false);
        }}
        onCreateSuccessfully={() => {
          setShowCreateProject(false);
        }}
      />
    </motion.div>
  );
};
