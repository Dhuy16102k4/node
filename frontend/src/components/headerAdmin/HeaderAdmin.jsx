import React, { useState } from "react";
import { Link } from "react-router-dom";  // Thêm Link từ react-router-dom
import "./headerAdmin.css";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InvertColorsOutlinedIcon from "@mui/icons-material/InvertColorsOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SupportOutlinedIcon from "@mui/icons-material/SupportOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HeadAdmin from "../headAdmin/HeadAdmin";

const HeaderAdmin = () => {
  const [Mobile, setMobile] = useState(false);

  return (
    <section className="header">
      <HeadAdmin/>
      <header>
        <div className="container">
          <ul className={Mobile ? "navMenu-list" : "link"} onClick={() => setMobile(false)}>
            <li>
              <Link to="/admin" className="navIcon">
                <DashboardOutlinedIcon className="navIcon active" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="../admin/product" className="navIcon" onClick={() => setMobile(false)}>
                <InvertColorsOutlinedIcon />
                Product Manage
              </Link>
            </li>
            <li>
              <Link to="/admin/user" className="navIcon">
                <GridViewOutlinedIcon />
                User Manage
              </Link>
            </li>
            <li>
              <Link to="/admin/category" className="navIcon">
                <SupportOutlinedIcon />
                Category Manage
              </Link>
            </li>
            <li>
              <Link to="/admin/pages" className="navIcon">
                <StyleOutlinedIcon />
                Pages
              </Link>
            </li>
          </ul>
          <button className="toggle" onClick={() => setMobile(!Mobile)}>
            {Mobile ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>
    </section>
  );
};

export default HeaderAdmin;
