/**
 * Frequently asked questions for this site — the mockup's "House rules", which
 * it sets on one ivory sheet on the wall of the salon and numbers in Roman.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data
 * from this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * argue one thing — that the KIND OF BONUS is the first question and the brand
 * is the second, because a welcome package, a cashback and a reload at the
 * same operator are three different contracts. Its siblings answer the
 * neighbouring questions (affliliate: what one offer is worth in money;
 * slottering: the slot rules; bettingbetway: which casino to trust;
 * bonanzasmile: the catch in a bonus; gladjackpot: how the money gets out;
 * luckycatsmile: that luck is the wrong word; spinsunny: when you get to read
 * the small print; starspinly: one scale for every operator; rollofjoy: what
 * an offer costs you in evenings; bigbrightday: whether the terms can be read
 * in one go; goodnewsdrop: what changed since last time; avantlinks: what must
 * be true before the link is pressed) and none of them may be echoed.
 *
 * NOTHING BELOW CLAIMS A FIGURE THIS SITE CANNOT SHOW. The mockup's own first
 * answer is "We open real accounts, deposit, claim the bonus and request a
 * withdrawal", and its fifth is "We publish the times we observed". Neither
 * ships in any wording: nothing in this project records a funded account or a
 * timed payment. The SECOND question is asked precisely so the answer can say
 * so outright, and the withdrawal question is answered by naming whose
 * commitment the figure actually is.
 *
 * The LAST question is this site's own, and it is the one no sibling asks:
 * why the catalogue is sorted by room at all. On a site named after its rooms
 * that answer belongs on the page rather than in an about page.
 */
export const FAQ_ITEMS = [
  {
    question: 'How do you rank the tables?',
    answer:
      'On three things, read in the order you meet them once you are through the door: whether the house will admit you, what each of its rooms asks for in return, and where the chips turn back into money. The licence and the list of accepted countries come first, because they are the only check that can end the matter — an account opened from a country the terms exclude can be closed at withdrawal. Then the bonus terms: the wagering multiplier and whether it applies to the bonus alone or to the deposit as well, the maximum stake allowed while clearing it, and the expiry. Then the cashier: the methods, the ceilings, the stated processing window and the point at which identity documents are demanded. An operator that states all of it plainly places above one with a louder banner.',
  },
  {
    question: 'Do you actually play at these casinos?',
    answer:
      'No, and we will not print a figure we did not read somewhere you can read it too. The salon is a way of arranging what operators publish, not a claim to have sat at the table. Everything here comes from pages the operator puts up itself — the promotion page, the bonus terms, the general terms, the cashier page and the regulator’s own register — quoted so it can be checked against the source. That is the method rather than a limitation of it: a site claiming its own deposits and withdrawals is asking to be believed about the one thing nobody else can check, where a published term is a matter of record anyone can go and look at.',
  },
  {
    question: 'Why sort bonuses into rooms rather than by casino?',
    answer:
      'Because a casino is not one offer. A welcome package, a cashback, a reload and a no-deposit offer at the same operator are four different contracts, with four different multipliers, four different ceilings and four different ways of costing more than they look like — and the one you are agreeing to is decided by which link you press, not by which brand you chose. Sorting by operator hides that: it asks you to pick a name and then discover the terms. Sorting by room puts the contract first, so the comparison you make is between things that are actually comparable, and the brand becomes what it should be — the second question, not the first.',
  },
  {
    question: 'Are the bonuses really worth it?',
    answer:
      'Sometimes, and the figure that decides it is never the one on the door. Read four things first: the multiplier and what it is applied to, the maximum stake allowed while clearing, the cap on what may be withdrawn from the bonus, and how long you have. A headline of 100% up to €500 at 25x on the bonus and the same headline at 40x on deposit plus bonus are the same advertisement and roughly three times the cost. Those sit next to the offer here, quoted from where the operator published them — and where they are hard to find at all, treat the difficulty itself as information about the offer.',
  },
  {
    question: 'How quickly can I withdraw a win?',
    answer:
      'That depends on your method and your verification status, and we publish no timings of our own because we have measured none. What we do publish is the window the operator commits to in writing on its own cashier page, together with the ceilings it applies and the point at which it will ask for documents. That is a commitment you could hold it to, which is worth more before you deposit than any average we could quote.',
  },
  {
    question: 'Which casinos are licensed?',
    answer:
      'Every casino in the salon holds a gaming licence, and each review names the regulator so the claim can be checked on that authority’s own register rather than taken on trust. Check the countries as well: a licence is not the same thing as permission for you personally to hold an account, and the list an operator publishes of the places it accepts is the first thing read about it here.',
  },
  {
    question: 'Do you earn money from these links?',
    answer:
      'Yes. We may earn a commission when you register through a link on this site, and that is what pays for the reading. It buys nothing else: rooms and tables are ordered editorially, every operator is read against the same three checks, and no operator sees a ranking before you do. It is said here, and under the hero, and again under the three checks, because it is the kind of thing you want before a click rather than after one.',
  },
] as const
