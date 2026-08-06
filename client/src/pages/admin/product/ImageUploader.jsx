import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";

function ImageUploader({
  images = [],
  onChange,
  multiple = true,
  title = "Drag & drop images here, or click to select",
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
        })
      );

      if (multiple) {
        onChange([...images, ...files]);
      } else {
        onChange(files);
      }
    },
  });

  const removeImage = (imageIndex) => {
    const updatedImages = images.filter((_, i) => i !== imageIndex);
    onChange(updatedImages);
  };

  useEffect(() => {
    return () => {
      images ? images.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      }) : [];
    };
  }, [images]);

  return (
    <div className="col-span-12">
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />

          <p className="p-4 mt-3 border-2 border-dashed border-stone-400 rounded-lg text-center cursor-pointer hover:border-stone-600 transition">
            {title}
          </p>
        </div>
      </section>
      {images.length > 0 && (
        <aside className="flex flex-wrap gap-3 mt-4 p-3 border rounded-lg">
          {images.map((file, index) => (
            <div
              key={file.name + index}
              className="group relative w-28 h-28 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100"
            >
              <img
                src={file.preview || file.url}
                alt={file.name || "Image"}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
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

