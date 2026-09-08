import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2, Sparkles, CircleCheckBig } from "lucide-react";

function ImageUploader({
  images = [],
  onChange,
  setPrimaryImage,
  multiple = true,
  title = "Drag & drop images here, or click to select",
  setDeletedProductMediaIds,
  isEditing,
  primary,
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple,
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          isExisting: false,
          isPrimary: false,
        }),
      );

      if (multiple) {
        onChange([...images, ...files]);
      } else {
        onChange(files);
      }
    },
  });

  const removeImage = (imageIndex, file) => {
    if (file.isExisting) {
      setDeletedProductMediaIds((ids) => [...ids, file.productMediaId]);
    }

    const updatedImages = images.filter((_, i) => i !== imageIndex);

    onChange(updatedImages);
  };

  useEffect(() => {
    return () => {
      images?.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [images]);

  return (
    <div>
      {/* Upload area */}
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />

          <p className="p-4 mt-3 border-2 border-dashed border-stone-400 rounded-lg text-center cursor-pointer hover:border-stone-600 transition">
            {title}
          </p>
        </div>
      </section>

      {/* Images */}
      {images.length > 0 && (
        <aside className="flex flex-wrap gap-3 mt-4 p-3 border rounded-lg">
          {images.map((file, index) => (
            <div
              dataId= {file.id ?? "test"}
              key={file.productMediaId || file.name || index}
              className="group relative w-28 h-28 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100"
            >
              {/* Image */}
              <img
                src={file.preview || file.url}
                alt={file.name || "Image"}
                className="w-full h-full object-cover"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* PRIMARY ICON - ALWAYS VISIBLE */}
              {file.isPrimary === true && primary ? (
                <button
                  type="button"
                  className="absolute top-2 left-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-white shadow-md"
                  title="Primary image"
                >
                  <Sparkles className="w-3 h-3" />
                </button>
              ) : (
                ""
              )}
              {primary == true && file.isPrimary === false && file.isExisting ? (
                <button
                  onClick={(e) => {
                     setPrimaryImage(index);
                  }}
                  className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                  title="Set Primary"
                >
                  <CircleCheckBig className="w-4 h-4" />
                </button>
              ) : (
                ""
              )}

              {/* DELETE BUTTON - ONLY ON HOVER */}
              <button
                type="button"
                onClick={() => removeImage(index, file)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                title="Delete image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </aside>
      )}
    </div>
  );
}

export default ImageUploader;
