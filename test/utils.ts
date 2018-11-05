export const lotsOfJunk = () =>
  [...Array(10).keys()].reduce(
    (res, _) => res.concat('some junk 🎰 🍍 🐖 '),
    ''
  )
