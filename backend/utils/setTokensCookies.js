const setTokensCookies = (res, accessToken, accessTokenExp) => {
  const accessTokenMaxAge =
    (accessTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  // set access token cookie
  res.cookie("accessToken", accessToken, {
    maxAge: accessTokenMaxAge,
    httpOnly: true,
    secure: true,
    // sameSite: "none",
  });
};

module.exports = setTokensCookies;
