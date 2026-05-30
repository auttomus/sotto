import * as React from "react";

interface MediaPreviewItemProps {
  file: File;
  className?: string;
}

export function MediaPreviewItem({ file, className = "w-full h-full object-cover" }: MediaPreviewItemProps) {
  const url = React.useMemo(() => URL.createObjectURL(file), [file]);

  React.useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  if (file.type.startsWith("video/")) {
    return (
      <video
        src={url}
        className={className}
        muted
        preload="metadata"
      />
    );
  }

  return <img src={url} alt="preview" className={className} />;
}
