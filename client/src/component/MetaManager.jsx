// src/components/MetaManager.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import server from "../cofig/config";

const MetaManager = () => {
  const [meta, setMeta] = useState(null);
  const getSiteSettings = async () => {
    const { data } = await axios.get(`${server}site-settings`); // change URL if needed
    return data;
  };


  useEffect(() => {
    const fetchMeta = async () => {
      const data = await getSiteSettings();
      setMeta(data);
    };

    fetchMeta();
  }, []);

  if (!meta) return null; // Or show loading

  return (
    <Helmet>
      <title>{meta.metaTitle}</title>
      <meta name="description" content={meta.metaDescription} />
      <meta property="og:title" content={meta.metaTitle} />
      <meta property="og:description" content={meta.metaDescription} />
      <meta property="og:image" content={meta.heroImage?.url} />
      <meta property="og:url" content={meta.ogUrl} />
      <meta property="og:type" content="website" />
      <meta name="author" content={meta.author || "Default Author"} />
      <meta name="theme-color" content="#000000" />
      <link rel="icon" href={meta.icon?.url} />
    </Helmet>
  );
};

export default MetaManager;
