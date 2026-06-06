import * as React from "react";

interface MediaPreviewItemProps {
  file: File;
  className?: string;
}

export function MediaPreviewItem({ file, className = "w-full h-full object-cover" }: MediaPreviewItemProps) {
  const [url, setUrl] = React.useState<string>("");

  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!url) {
    return <div className="w-full h-full bg-muted animate-pulse" />;
  }

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
