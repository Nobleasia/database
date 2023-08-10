import { CreateNewItemSectionItem } from "./create-new-item-section-item";

export const CreateNewItemSection = ({
  root,
  slug,
  sectionItems,
  sectionRoot,
  setCurrentActiveSectionNumber,
  currentActiveSectionNumber,
}) => {
  return (
    <div className="flex items-center gap-12 p-1 pb-5 scrollbar-thin scrollbar-track-npa-cream-200 scrollbar-thumb-npa-cream-500 scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg md:justify-between">
      {sectionItems.map((section) => {
        return (
          <CreateNewItemSectionItem
            key={`section-item-${root}-${section.sectionTitle}-${section.numberOfSection}`}
            {...section}
            root={root}
            slug={slug}
            sectionRoot={sectionRoot}
            onCurrentActiveSection={setCurrentActiveSectionNumber}
            isActive={section.numberOfSection === currentActiveSectionNumber}
            hasPassed={section.numberOfSection < currentActiveSectionNumber}
          />
        );
      })}
    </div>
  );
};
