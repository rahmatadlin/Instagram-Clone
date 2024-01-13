import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./configs/apollo";
import { LoginProvider } from "./context/LoginContext";
import StackHolder from "./stacks/StackHolder";

// Komponen utama yang mencakup penyedia Apollo dan context login
export default function App() {
  return (
    <ApolloProvider client={client}>
      <LoginProvider>
        <StackHolder />
      </LoginProvider>
    </ApolloProvider>
  );
}
