import { useState } from "react";
import { FaBookOpen } from "react-icons/fa6";
import { IconButton } from "../../shared/icon-button";
import { Document, Page, pdfjs } from "react-pdf";
import { Modal } from "../../shared/modal";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Pagination } from "../../shared/pagination";
import { produce } from "immer";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const UserGuide: React.FC = () => {
  // Show modal
  const [showUserGuide, setShowUserGuide] = useState<boolean>(false);

  // PDF
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <>
      <div className="ml-1 mr-1">
        <IconButton tooltip="User guide" onClick={() => setShowUserGuide(true)}>
          <FaBookOpen className="text-xl text-primary-500 dark:text-primary-600" />
        </IconButton>
      </div>

      <Modal
        className="flex flex-col justify-center items-center bg-white dark:bg-white rounded-2xl w-[550px] h-[95vh] overflow-hidden"
        show={showUserGuide}
        onClose={() => {
          setShowUserGuide(false);
        }}
      >
        <div className="relative min-w-[550px] min-h-[95vh]">
          <Document
            className="-mt-3 ml-3"
            file={
              import.meta.env.VITE_USER_GUIDE_URL
                ? import.meta.env.VITE_USER_GUIDE_URL
                : "/user-guide.pdf"
            }
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page height={750} pageNumber={pageNumber} />
          </Document>

          <div className="absolute bg-black/10 dark:bg-black/70 shadow z-20 w-full pb-3 pt-3 bottom-[0px] left-0 px-10 opacity-0 hover:opacity-100 duration-200">
            <Pagination
              className="-ml-1.5 z-10"
              page={pageNumber}
              totalPage={numPages || 1}
              onPageChange={(page) => {
                page ? setPageNumber(page) : setPageNumber(1);
              }}
              onPrevious={() => {
                setPageNumber(
                  produce((page) => {
                    if (page === null || page === undefined) {
                      return numPages;
                    } else if (page > 1) {
                      return page - 1;
                    }
                  }),
                );
              }}
              onNext={() => {
                setPageNumber(
                  produce((page) => {
                    if (page === null || page === undefined || !numPages) {
                      return 1;
                    } else if (page < numPages) {
                      return page + 1;
                    }
                  }),
                );
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
