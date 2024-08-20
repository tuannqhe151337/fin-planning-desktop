import React, { useEffect, useState } from "react";
import { Modal } from "../../shared/modal";
import { IconButton } from "../../shared/icon-button";
import { IoClose } from "react-icons/io5";
import { Button } from "../../shared/button";
import { TEInput } from "tw-elements-react";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputValidationMessage } from "../../shared/validation-input-message";
import {
  Project,
  useUpdateProjectMutation,
} from "../../providers/store/api/projectsApi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import { uppercaseFirstCharacter } from "../../shared/utils/uppercase-first-character";
import { ErrorData } from "../../providers/store/api/type";
import clsx from "clsx";

type FormData = {
  projectName: string;
};

const ProjectNameSchema = z
  .string()
  .min(5, "Project name length must be at least 5 characters")
  .max(50, "Project name length must be at most 50 characters");

export const UpdateProjectSchema: ZodType<FormData> = z.object({
  projectName: ProjectNameSchema,
});

interface Props {
  show: boolean;
  project: Project;
  onClose: () => any;
  onUpdateSuccessfully?: () => any;
}

export const ProjectEditModal: React.FC<Props> = ({
  show,
  project,
  onClose,
  onUpdateSuccessfully,
}) => {
  // Form
  const {
    register,
    watch,
    formState: { dirtyFields, isValid },
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(UpdateProjectSchema), // Apply the zodResolver
    defaultValues: {
      projectName: project.name,
    },
  });

  // Reset
  useEffect(() => {
    reset();
  }, [show]);

  // Update form on external Project name change
  useEffect(() => {
    setValue("projectName", project.name);
  }, [project]);

  // Update new Project mutation
  const [updateProject, { isSuccess, isLoading, isError, error }] =
    useUpdateProjectMutation();

  // On submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    updateProject({
      projectId: project.projectId,
      projectName: data.projectName,
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast("Update Project successfully!", { type: "success" });

      onUpdateSuccessfully && onUpdateSuccessfully();
    }
  }, [isLoading, isSuccess]);

  // Error message
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (isError) {
      if (error && "data" in error && "message" in (error.data as any)) {
        setErrorMessage(
          uppercaseFirstCharacter((error.data as ErrorData).message)
        );
      } else {
        setErrorMessage("Something went wrong, please try again!");
      }
    }
  }, [isError]);

  return (
    <Modal
      className="w-[45vw] h-max flex flex-col justify-center items-center"
      show={show}
      onClose={onClose}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-10 py-8">
        <div className="absolute top-3 right-5">
          <IconButton
            className="hover:bg-neutral-100"
            onClick={(event) => {
              event.stopPropagation();
              onClose && onClose();
            }}
          >
            <IoClose className="text-3xl text-neutral-500" />
          </IconButton>
        </div>

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center w-full">
            <div className="font-bold dark:font-extra bold text-2xl text-primary-400 dark:text-primary-500/70 -mt-2.5">
              Update Project
            </div>

            <ErrorNotificationCard
              className="mt-3"
              show={!isLoading && isError}
              errorMessage={errorMessage}
            />

            <div
              className={clsx({
                "w-full": true,
                "mt-5": !isError,
                "mt-1.5": isError,
              })}
            >
              <TEInput
                autoFocus
                className="w-full"
                label="Project name"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.currentTarget.blur();
                  }
                }}
                {...register("projectName", { required: true })}
              />
              <InputValidationMessage
                show={dirtyFields.projectName || false}
                validateFn={() => ProjectNameSchema.parse(watch("projectName"))}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-row gap-3 w-full">
            <Button
              type="button"
              variant="tertiary"
              tabIndex={-1}
              className="font-bold w-[200px] p-3"
              onClick={() => {
                onClose && onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              tabIndex={-1}
              containerClassName="flex-1"
              className="p-3"
            >
              {!isLoading && "Update Project"}
              {isLoading && (
                <CgSpinner className="m-auto text-lg animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
