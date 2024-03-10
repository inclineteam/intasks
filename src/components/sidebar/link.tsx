import { Slot, component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

interface ISidebarLink {
  link: string;
  name: string;
}

export const SidebarLink = component$<ISidebarLink>((props) => {
  const location = useLocation();
  const toPathname = props.link;
  const locationPathname = location.url.pathname;

  const startSlashPosition =
    toPathname !== "/" && toPathname.startsWith("/")
      ? toPathname.length - 1
      : toPathname.length;
  const endSlashPosition =
    toPathname !== "/" && toPathname.endsWith("/")
      ? toPathname.length - 1
      : toPathname.length;
  const isActive =
    locationPathname === toPathname ||
    (locationPathname.endsWith(toPathname) &&
      (locationPathname.charAt(endSlashPosition) === "/" ||
        locationPathname.charAt(startSlashPosition) === "/"));

  return (
    <li>
      <Link
        href={props.link}
        class={[
          "flex space-x-3 rounded-md px-4 py-2 text-sm font-medium",
          isActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800",
        ]}
      >
        <div class="flex space-x-3">
          <Slot />
          <span>{props.name}</span>
        </div>
      </Link>
    </li>
  );
});
