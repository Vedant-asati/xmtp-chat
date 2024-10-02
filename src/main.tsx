import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";
import "@animxyz/core";


import "./polyfills";
import "./index.css";

import ClientProvider from "./contexts/ClientContext.tsx";
import { findConversation } from "./model/conversations";

import DashboardLayout from "./components/dashboard";
import App from "./App.tsx";
import ConversationViewWithLoader from "./views/ConversationViewWithLoader.tsx";
import NewConversationView from "./views/NewConversationView.tsx";
import GroupView from "./views/GroupView.tsx";
import GroupConversationView from "./views/GroupConversationView.tsx";
import NewGroupView from "./views/NewGroupView.tsx";
import LoadingScreen from "./components/LoadingScreen";
import Page404 from "./pages/Page404.tsx";

import GeneralApp from "./pages/GeneralApp.tsx";
import Conversation from "./pages/Conversation.tsx";
import Chats from "./pages/Chats.tsx";
import Settings from "./pages/Settings.tsx";
// import Contact from "./components/sections/Contact.tsx";

import WalletContext from "./contexts/WalletContext.tsx";
import { SettingsContext } from "./contexts/SettingsContext.tsx";

async function conversationLoader({ params }: any) {
  const conversation = await findConversation(params.conversationTopic);
  return { conversation };
}

// async function groupConversationLoader({ params }: any) {
//   const conversation = await findConversation(params.conversationTopic);
//   return { conversation };
// }


// Lazy load pages
// const Loadable = (Component) => (props) => (
//   <Suspense fallback={<LoadingScreen />}>
//     <Component {...props} />
//   </Suspense>
// );

// Loadable components
// const ConversationViewWithLoader = Loadable(lazy(() => import("./views/ConversationViewWithLoader")));
// const GroupConversationView = Loadable(lazy(() => import("./views/GroupConversationView")));
// const NewConversationView = Loadable(lazy(() => import("./views/NewConversationView")));
// const NewGroupView = Loadable(lazy(() => import("./views/NewGroupView")));
// const GroupView = Loadable(lazy(() => import("./views/GroupView")));
// const Page404 = Loadable(lazy(() => import("./views/Page404")));  // 404 page


const router = createHashRouter([
  {
    path: "/",
    element: <DashboardLayout />,  // Use your main layout component
    children: [
      { path: "/", element: <Navigate to="/app" replace />, index: true }, // Default route
      {
        path: "app",
        element: <App />,
      },
      {
        path: "c/:conversationTopic",
        element: <ConversationViewWithLoader />,
        loader: conversationLoader,
      },
      {
        path: "new",
        element: <NewConversationView />,
      },
      {
        path: "groups/new",
        element: <NewGroupView />,
      },
      // GroupView is For testing purpose
      {
        path: "groups",
        element: <GroupView />,
      },
      {
        path: "group/:groupId",
        element: <GroupConversationView />,
      },
      {
        path: "dashboard",
        element: <GeneralApp />,
      },
      {
        path: "conversation",
        element: <Conversation isMobile={true} menu={true} />,
      },
      {
        path: "chats",
        element: <Chats />,
      },
      // {
      //   path: "contact",
      //   element: <Contact />,
      // },
      {
        path: "*",
        element: <Navigate to="/404" replace />
      },
    ],
  },
  { path: "*", element: <Page404 /> }, // Catch-all route for 404
]);

// { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
// { path: "app", element: <GeneralApp /> },
// { path: "settings", element: <Settings /> },
// { path: "conversation", element: <Conversation /> },
// { path: "chats", element: <Chats /> },
// //
// { path: "contact", element: <Contact /> },
// { path: "404", element: <Page404 /> },
// { path: "*", element: <Navigate to="/404" replace /> },

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClientProvider>
      <WalletContext>
        <RouterProvider router={router} />
      </WalletContext>
    </ClientProvider>
  </React.StrictMode>
);
