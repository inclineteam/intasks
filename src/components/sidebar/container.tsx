import { component$ } from "@builder.io/qwik";
import { SidebarLink } from "./link";
import {
  LuCheckSquare,
  LuFolder,
  LuHome,
  LuSettings,
} from "@qwikest/icons/lucide";
import Logo from "../../../public/logo.svg?jsx";

export const Sidebar = component$(() => {
  const links = [
    {
      icon: LuHome,
      link: "/dashboard/",
      name: "Dashboard",
    },
    {
      icon: LuFolder,
      link: "/projects/",
      name: "Projects",
    },
    {
      icon: LuCheckSquare,
      link: "/tasks/",
      name: "Tasks",
    },
    {
      icon: LuSettings,
      link: "/settings/",
      name: "Settings",
    },
  ];

  return (
    <div class="min-w-[18rem] px-10 pt-10">
      <header class="flex space-x-2">
        <Logo class="h-8 w-8" />
        <p class="text-2xl font-bold tracking-tight text-zinc-800">Intasks</p>
      </header>

      <hr class="my-8" />

      <nav>
        <ul class="space-y-2">
          {links.map((link, i) => (
            <SidebarLink key={i} link={link.link} name={link.name}>
              <link.icon class="h-5 w-5" />
            </SidebarLink>
          ))}
        </ul>
      </nav>
    </div>
  );
});
