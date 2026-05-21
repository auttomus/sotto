import * as React from "react";
import { useCreateStore } from "~/features/create/store/useCreateStore";
import { TypeSelector } from "~/features/create/components/TypeSelector";
import { PostWizard } from "~/features/create/components/PostWizard";
import { ListingWizard } from "~/features/create/components/ListingWizard";

export default function CreateWizardRoute() {
  const selectedType = useCreateStore(s => s.selectedType);
  
  if (selectedType === null) {
    return <TypeSelector />;
  }

  if (selectedType === "portfolio" || selectedType === "pengalaman") {
    return <PostWizard />;
  }

  if (selectedType === "penawaran") {
    return <ListingWizard />;
  }

  return null;
}
