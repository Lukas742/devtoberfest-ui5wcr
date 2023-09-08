import {
  List,
  ListMode,
  Popover,
  PopoverPlacementType,
  ShellBar,
  ShellBarItem,
  StandardListItem
} from "@ui5/webcomponents-react/ssr";
import { useRouter } from "next/router";
import { ReactNode, useRef, useState } from "react";
import classes from "./AppShell.module.css";
import paletteIcon from "@ui5/webcomponents-icons/dist/palette.js";
import type { ListPropTypes, PopoverDomRef, ShellBarItemPropTypes } from "@ui5/webcomponents-react";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import { ThemeContextProvider } from "../../context/ThemeContext";


const themes = [
  { key: "sap_horizon", name: "Morning Horizon (Light)" },
  { key: "sap_horizon_dark", name: "Evening Horizon (Dark)" },
  { key: "sap_horizon_hcb", name: "Horizon High Contrast Black" },
  { key: "sap_horizon_hcw", name: "Horizon High Contrast White" }
];

export function AppShell(props: { children: ReactNode }) {
  const router = useRouter();
  const popoverRef = useRef<PopoverDomRef | null>(null);
  const [theme, setThemeState] = useState("sap_horizon");

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleShellBarItemClick: ShellBarItemPropTypes["onClick"] = (e) => {
    const { targetRef } = e.detail;
    popoverRef.current?.showAt(targetRef);
  };

  const handleThemeSwitch: ListPropTypes["onSelectionChange"] = (e) => {
    const { targetItem } = e.detail;
    setTheme(targetItem.dataset.key!);
    setThemeState(targetItem.dataset.key!);
  };

  return (
    <>
      <ThemeContextProvider value={theme}>
        <div className={classes.appShell}>
          <ShellBar
            primaryTitle="Movie DB"
            logo={
              <img
                src="https://sap.github.io/ui5-webcomponents/assets/images/sap-logo-svg.svg"
                alt="SAP Logo"
              />
            }
            onLogoClick={handleLogoClick}
          >
            <ShellBarItem icon={paletteIcon} onClick={handleShellBarItemClick} />
          </ShellBar>
          <div className={classes.scrollContainer}>{props.children}</div>
          <Popover
            ref={popoverRef}
            placementType={PopoverPlacementType.Bottom}
            className="contentNoPadding"
          >
            <List
              mode={ListMode.SingleSelect}
              onSelectionChange={handleThemeSwitch}
            >
              {themes.map((item) => (
                <StandardListItem
                  data-key={item.key}
                  key={item.key}
                  selected={theme === item.key}
                >
                  {item.name}
                </StandardListItem>
              ))}
            </List>
          </Popover>
        </div>
      </ThemeContextProvider>
    </>
  );
}
