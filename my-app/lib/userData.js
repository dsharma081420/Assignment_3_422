import { getToken } from "@/lib/authenticate";
import { getApiBase } from "@/lib/apiBase";

// All functions: async, Authorization header "JWT <token>",
// return res.json() on 200, or [] on any other status

export async function getFavourites() {
  const base = getApiBase();
  const res = await fetch(`${base}/favourites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${getToken()}`,
    },
  });
  if (res.status === 200) {
    return await res.json();
  } else {
    return [];
  }
}

export async function addToFavourites(id) {
  const base = getApiBase();
  const res = await fetch(`${base}/favourites/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${getToken()}`,
    },
  });
  if (res.status === 200) {
    return await res.json();
  } else {
    return [];
  }
}

export async function removeFromFavourites(id) {
  const base = getApiBase();
  const res = await fetch(`${base}/favourites/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${getToken()}`,
    },
  });
  if (res.status === 200) {
    return await res.json();
  } else {
    return [];
  }
}
