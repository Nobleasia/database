import * as TooltipRadix from "@radix-ui/react-tooltip";

export const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  sideOffset,
  alignOffset,
  ...props
}) => {
  return (
    <TooltipRadix.Provider delayDuration={0}>
      <TooltipRadix.Root open onOpenChange={onOpenChange}>
        <TooltipRadix.Trigger asChild>{children}</TooltipRadix.Trigger>
        <TooltipRadix.Content
          side="top"
          align="center"
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          {...props}
          className="rounded-md bg-npa-purple-600/30 p-2 text-npa-purple-900 backdrop-blur-sm"
        >
          {content}
          <TooltipRadix.Arrow
            width={11}
            height={5}
            className="fill-npa-purple-600/30"
          />
        </TooltipRadix.Content>
      </TooltipRadix.Root>
    </TooltipRadix.Provider>
  );
};
