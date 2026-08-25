import { useState, useRef } from "react";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState("");
  const passwordRef = useRef(null);

  return {
    email,
    setEmail,
    password,
    setPassword,
    focused,
    setFocused,
    passwordRef,
  };
}
