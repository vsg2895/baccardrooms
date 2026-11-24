/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * brands are separate domains serving the same catalogue, and if they shipped
 * the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * ── baccardrooms' angle: WHICH ROOM YOU ARE WALKING INTO ───────────────────
 *
 * Its unit is THE ROOM — the kind of bonus — and not the operator. That is
 * the one thing no sibling does, and it is where the brand's name is.
 *
 * The thought is this. Every site in this network, and nearly every
 * comparison site anywhere, is organised as a league table of operators: pick
 * the best casino, then find out what sort of offer it happens to be running.
 * But an operator is not one proposition. A welcome package, a cashback, a
 * reload and a no-deposit offer at the SAME casino are four different
 * contracts, with four different wagering multipliers, four different caps and
 * four different ways of going wrong — and the one you walk into is decided
 * by which link you press, not by which brand you chose.
 *
 * So this salon puts the room first. A room is a bonus type; it is numbered
 * in Roman numerals, like a door off a corridor; and the figure on its door
 * is how many offers of that kind are open. The tables inside — the casinos —
 * are still ranked, still carry the same three checks, and still link out the
 * same way. They are just no longer the first question the page asks.
 *
 * The clean lines against the nearest siblings: avantlinks owns the outbound
 * LINK and what must be true before it is pressed; spinsunny owns WHEN an
 * operator lets you see a figure; gladjackpot owns the cash-out; affliliate
 * decodes ONE offer in detail; bonanzasmile promises no surprises. None of
 * them organises the catalogue by the kind of contract, and none of them
 * treats "which kind of bonus is this" as the question that comes first.
 *
 * ── The salon is a metaphor, not a claim ───────────────────────────────────
 *
 * The mockup leans hard on first-person play, and NONE OF IT SHIPS:
 *
 *   "We take a seat at every casino we list — deposit, claim the bonus, play
 *   it through and cash out", the two proof figures ("Real money / tested at
 *   every casino" and "Weekly / terms re-checked"), the FAQ's "We open real
 *   accounts, deposit, claim the bonus and request a withdrawal", and
 *   "We publish the times we observed".
 *
 * This project reads published pages. It does not fund accounts, clear
 * wagering or time withdrawals, so it cannot say any of that, and a salon
 * whose whole pitch is "the house plays fair here" has to be the last place
 * that invents a fact. The three checks below are reads of pages anyone can
 * open, and the method band says so in as many words.
 *
 * Four more mockup elements are absent for the same family of reasons:
 *
 *   - the per-card "Min. deposit" and "Payout" facts, and the glance sheet's
 *     "Avg. payout time: Under 1 hour" — no column in this API holds either,
 *     so both would be invented per casino;
 *   - the country <select>, because the catalogue filters by category and not
 *     by geography, and a control that silently does nothing is worse than no
 *     control;
 *   - the top-three's BANKER / PLAYER / TIE labels. They are the three
 *     baccarat bets, and the first of them is the one with the lowest house
 *     edge — so labelling the highest-placed casino "Banker" reads as a
 *     recommended wager rather than a seat at a table. The three seats are
 *     numbered instead, which is what the ranking actually is.
 *
 * What IS kept from the mockup, because it claims nothing: the salon
 * language, the rooms, the suits, "Natural 9" as the leader's flag (the name
 * of the best hand in the game the brand is named after, used as a label the
 * way a sibling uses "Top pick"), and the house rules on one printed sheet.
 */

export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Casino Reviews By Room',
    description:
      'sorts online casino bonuses by the kind of contract they are — welcome, cashback, reload, no deposit — and lists the operators running each one with the licence, the terms and the cashier rules they publish.',
    keywords: [
      'casino bonuses by type',
      'welcome bonus vs cashback vs reload terms',
      'wagering requirements compared by bonus kind',
      'no deposit offers and what they ask for',
      'independent casino rankings',
    ],
    // The strapline under the wordmark, in the header and the footer. The
    // mockup's own, and it stays: three words that say what the place is.
    editionLabel: 'Private casino salon',
    mastheadStrapline: 'The members’ guide to online casinos',
    // The wordmark, split so the tail can take the brass italic — the
    // mockup's `Baccard<i>Rooms</i>`.
    wordmarkHead: 'Baccard',
    wordmarkTail: 'Rooms',
  },
  // ── The top bar ──────────────────────────────────────────────────────────
  // The mockup's own strip above the header. Its left-hand line is
  // "Members' notice: new tables tested this week — fresh bonuses inside",
  // which is two claims this site cannot make — a test, and a thing that
  // happened "this week" printed on a statically generated page where it
  // would still say so in March. Replaced with the one sentence that is true
  // on every build and is also the site's whole method.
  topBar: {
    note: 'Every figure in this salon is quoted from the operator’s own terms, cashier and licence pages.',
    meta: 'Independent reviews · 18+ only',
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it. winpalack keeps "Special Offers": its page is the
    // grouped bonus-area view and is a different thing.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    // The heading over the home page's offers — the mockup's own
    // "Chips On The Table".
    bonus: 'Chips On The Table',
    // The line under it. The mockup's is "Bonuses worth placing — terms
    // checked before we list them", which claims a check this site does not
    // perform as a gate. This says what is actually on the card.
    bonusesSubtitle:
      'Grouped by the room they belong to, each one carrying the figure its operator leads with and the page that figure was published on.',
    seeMore: 'See more',
    seeAllBonuses: 'See All Bonuses',
    /**
     * The VISIBLE heading over the bonus-type panel.
     *
     * On this site that panel is THE ROOMS, and it is the whole organising
     * idea rather than a navigation convenience — so unlike every sibling it
     * sits directly under the hero, above the casino list, and it is the
     * first set of links on the page.
     */
    bonusTypesTitle: 'Browse By Room',
    // The hero's eyebrow — the mockup's own line.
    heroEyebrow: 'The members’ guide to online casinos',
    // Split in three so the JSX can set the middle phrase in the display
    // face's true italic, in brass — the mockup's `.hero h1 em`. The tail
    // carries the full stop so the italic does not have to.
    heroHeadline: 'Step into the',
    heroHighlight: 'right room',
    heroHeadlineTail: '.',
    heroSubtitle:
      'A casino is not one offer. A welcome package, a cashback and a reload at the same table are three different contracts, and the one you are agreeing to is decided by which link you press. So this salon lists the rooms first — what each kind of bonus asks for in return, who is running one, and what the house has put in writing about getting your money back out.',
    // The exact phrase inside heroSubtitle that takes the ITALIC EMPHASIS.
    // Kept as a key rather than as markup so the string above stays plain
    // text, readable in a <title> and in JSON-LD with no tags to strip. The
    // page splits on it; if it ever stops matching, the deck simply renders
    // unmarked rather than breaking.
    heroSubtitleMark: 'lists the rooms first',
    // The byline under the hero. The mockup has two proof figures there, both
    // of them claims about testing — see the file header. This is the one
    // disclosure that belongs above the fold instead.
    heroBylineName: 'Independently ranked',
    heroBylineNote: 'Our links earn a commission. They buy no seat at the top.',
    // ── The head of the TABLE beside the hero ─────────────────────────────
    // The mockup's `.table .tl`: a small label over an italic line.
    podiumBadge: 'Tonight’s table',
    podiumTitle: 'The top three, dealt',
    podiumSubtitle: 'The three highest-placed casinos in this ranking.',
    // The label on a top-three entry's rating. The mockup prints a minimum
    // deposit there; nothing in the API holds one, so the slot carries the
    // rating.
    podiumRatingLabel: 'Rated',
    // The three seats at the table, in place of the mockup's BANKER / PLAYER
    // / TIE — see the file header for why those are not shipped.
    podiumSeats: ['First seat', 'Second seat', 'Third seat'],
    podiumAll: 'See the whole room',
    topCasinosTitle: 'The Tables, Ranked',
    topCasinosSubtitle:
      'Every operator in the salon, ordered on what it publishes about its licence, its bonus terms and its cashier. Filter by category.',
    featuredCasinos: 'See the tables',
    specialOffers: 'Browse the rooms',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Casino Bonuses Sorted By The Room They Belong To',
    faqTitle: 'Questions At The Table',
    faqSubtitle: 'How the rooms are sorted, what we read to sort them, and what the link at the end of a row does.',
    metaDescription:
      'A private salon of casino reviews: bonuses sorted into rooms by the kind of contract they are, each operator listed with the licence it holds, what its bonus asks for in return and the withdrawal rules it publishes.',
    // ── The "How we read a room" band ─────────────────────────────────────
    // THREE CHECKS, in the order a reader meets them — which is the whole
    // reason they are numbered, and why they are named after three physical
    // places in a casino rather than after three abstractions. The door
    // decides whether you get in at all. The stakes decide what the room
    // costs. The cage is where chips become money, and it is the only one of
    // the three that most people never read before they need it.
    //
    // The mockup's own three are DEPOSIT / PLAY / WITHDRAW, each describing a
    // funded account and a timed withdrawal. See the file header: none of
    // that ships. These are the three reads that answer the same questions
    // from pages anyone can open.
    methodTitle: 'How we read a room',
    methodSubtitle: 'Three checks, in the order you meet them once you are through the door.',
    methodSteps: [
      {
        no: 'I',
        verb: 'The door',
        title: 'Whether the house will admit you',
        body:
          'The regulator named in the operator’s footer, checked against that regulator’s own public register, and the list of countries the operator itself says it accepts. This is first because it is the only check that can end the matter before anything else is worth reading: an account opened from a country the terms exclude can be closed at withdrawal with the balance forfeited, and every operator reserves that right in writing.',
      },
      {
        no: 'II',
        verb: 'The stakes',
        title: 'What the room asks for in return',
        body:
          'The wagering multiplier and exactly what it is applied to — the bonus alone, or the bonus and the deposit together, which is the same headline figure at twice the cost. Then the maximum stake allowed while clearing it, which games count and at what weighting, and when the offer expires. All of it from the bonus terms rather than the banner; where the two disagree, the terms are what gets recorded here.',
      },
      {
        no: 'III',
        verb: 'The cage',
        title: 'Where the chips turn back into money',
        body:
          'The withdrawal methods the operator publishes, the minimum and maximum it will process, any weekly or monthly ceiling, the processing window it states, and the point at which identity documents are demanded. We do not time a payout and we do not print one. What is recorded is what the house has committed to in writing — which is the part you could hold it to.',
      },
    ],
    // NOT 'How we read a room': that is `methodTitle`, and a kicker printing
    // the heading again two lines above it is a second name for the section
    // that happens to be the same name.
    methodLabel: 'What we read',
    // Under the three checks: the one thing left to say before any link, and
    // the reason it sits here rather than in a policy page.
    methodLoop:
      'One more rule of the house, before any link: we earn a commission when you join through one. It pays for the reading. It buys no seat at the top of a table, and no operator sees a ranking before you do.',
    // ── What one review covers ────────────────────────────────────────────
    // The same three things the method and the FAQ name — and no figure this
    // site does not hold.
    monitorTitle: 'What a review covers',
    monitorStatus: 'Every table',
    monitorReads: [
      { label: 'I · The door', text: 'The regulator, its register, and the countries admitted' },
      { label: 'II · The stakes', text: 'Wagering and what it applies to, max stake, expiry' },
      { label: 'III · The cage', text: 'Methods, ceilings, the stated window, when ID is asked for' },
    ],
    monitorNote:
      'A lapsed offer comes off its door. A table moves when the operator’s own pages move, and for no other reason.',
    // The kickers over each section head.
    rankingLabel: 'The tables',
    bonusTypesKicker: 'The rooms',
    bonusesLabel: 'On the felt',
    faqLabel: 'House rules',
  },
  casinos: {
    pageTitle: 'Every Table In The Salon',
    pageDescription:
      'The full ranking: each operator with the rooms it is currently running, the countries it says it admits, and where it places once its licence, its bonus terms and its cashier rules have been read.',
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Rooms Open At This Table',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    moreHeading: 'Other Tables In This Salon',
    reviewTitleTail: 'Licence, Bonus Rooms And Withdrawals',
    reviewSignature:
      'Every figure on this page is quoted from this operator’s own terms, cashier and licence pages.',
    reviewSummary:
      'with the three things worth reading before you sit down — whether the house admits you, what each of its rooms asks for in return, and where the chips turn back into money — taken from the operator’s own pages rather than its banner.',
    // The flag over the leader's card. "Natural 9" is the best hand in the
    // game this brand is named after, used here the way a sibling uses "Top
    // pick" — an editorial label, not a figure. The mockup draws no rank
    // numeral on a card and neither does this network: the list order IS the
    // ranking, and a numeral beside a 5.0 rating invites being read as a
    // second score.
    // The kicker over the bonus figure on a card — the mockup's `.cbonus
    // small`, which says "Welcome bonus". Nothing in the API says the figure
    // on `casino.bonuses` IS a welcome bonus, so this does not claim it is.
    bonusLabel: 'Current bonus',
    topPick: 'Natural 9 · Top pick',
    visitCasino: 'Open Casino',
    readReview: 'Read Review',
    rating: 'Rooms Score',
    noResults: 'No tables open for this filter yet.',
  },
  /**
   * The page behind one bonus type — one ROOM (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the room's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix:
      'every offer of this kind in the salon, with whose table it is on and the figure the operator leads with — plus what that figure asks for in return.',
    // The word before a room's Roman numeral — "Room I". A DOOR NUMBER, not
    // a ranking: the types arrive in the admin's own priority order, which is
    // an editorial sort of them and not a judgement of them.
    roomLabel: 'Room',
    countOne: 'offer',
    countMany: 'offers',
  },

  specialOffers: {
    pageTitle: 'Every Chip On The Table',
    pageDescription:
      'All of the salon’s bonuses in one place, each with the table behind it and the figure it leads with — and, wherever the operator states them, the wagering, the ceiling and the expiry that figure comes with.',
    // Appended to an offer's (shared) bonus text so the sibling sites do not
    // ship an identical meta description for the same offer.
    offerMetaSuffix: 'Read from the operator’s own bonus terms, not its banner.',
    claim: 'Claim Bonus',
    noResults: 'No chips on the table right now.',
  },
  categories: {
    pageTitle: 'Tables By Category',
    pageDescription: 'The same three checks behind every list — pick the category you came in for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the sites distinct there.
    categoryMetaSuffix:
      'ordered on what each operator publishes about its licence, its bonus rooms and its cashier — read before the link rather than after it.',
    noResults: 'Nothing in this category yet.',
  },
  newsletter: {
    title: 'The members’ notice.',
    subtitle: 'New tables, the rooms worth a seat, and any ranking that moved — one short email.',
    placeholder: 'you@example.com',
    button: 'Subscribe',
    // The two halves of the line in the HEADER STRIP — a paper band directly
    // under the header, outside it, so it scrolls away once it has been seen.
    barLead: 'The members’ notice.',
    barTail: 'New tables, the rooms worth a seat, and any ranking that moved — one short email a week.',
    // The band above the footer — the site's second capture point, so its
    // heading is a real <h2> rather than the form's own label.
    bandKicker: 'The notice',
    bandTitle: 'One email a week, before you go looking.',
    bandSubtitle:
      'New tables in the salon, the rooms we think are worth a second read, and any ranking that moved — short, and never more than once a week.',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column. The mockup gives that
    // column 1.6fr of a four-track grid — roughly 360px — so this runs to two
    // or three lines there by design.
    tagline:
      'Independent casino reviews and rankings, sorted by the kind of bonus each one is and written from what the operator publishes about its licence, its terms and its cashier. We earn a commission from links on this site; it never changes a score or a position.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    //
    // Supplied 2026-11-24, and written to this site's `registered_address`
    // in the same change (`php artisan sites:set-legal-identity <slug>
    // --address=...`). THE TWO MUST STAY IDENTICAL: that column is what the
    // legal pages and the email templates print, and two different addresses
    // for one brand is a compliance problem, not a typo. The footer omits the
    // whole <address> element while this is blank.
    postalAddress: '15 Lavender Way, Oxford, OX3 8KL, United Kingdom',
    disclaimer:
      'Gambling is for adults aged 18 or over and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'That page is not here.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'What Players Report',
    empty: 'No reports yet — be the first to add one.',
    formTitle: 'Add Your Report',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    namePlaceholder: 'First name or nickname',
    emailPlaceholder: 'you@example.com',
    titlePlaceholder: 'One line on whether the room matched its terms',
    bodyPlaceholder: 'Which offer did you take, what did its terms say, and did the house stick to them?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'The rooms',
  },
} as const
