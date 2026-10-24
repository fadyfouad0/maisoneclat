// Reads products from Sanity (public dataset, read-only). Shared by collection, product and home pages.
(function () {
  var PROJECT = 'hnoq2gu0', DATASET = 'production', VERSION = 'v2025-01-01';
  var LABEL = { 'New': 'lb-new', 'In the showroom': 'lb-show', 'Made to order': 'lb-order', 'Last piece': 'lb-last' };

  function query(groq, params) {
    var url = 'https://' + PROJECT + '.apicdn.sanity.io/' + VERSION + '/data/query/' + DATASET + '?query=' + encodeURIComponent(groq);
    Object.keys(params || {}).forEach(function (k) { url += '&$' + k + '=' + encodeURIComponent(JSON.stringify(params[k])); });
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('Sanity request failed: ' + r.status);
      return r.json();
    }).then(function (j) { return j.result; });
  }

  function img(url, w) { return url ? url + '?w=' + (w || 900) + '&auto=format&q=80' : ''; }
  function egp(n) { return 'EGP ' + Number(n).toLocaleString('en-US'); }
  function price(n) { return n == null ? 'On request' : egp(n); }

  // Only complete products: a slug, an image and a plain-text category (skips drafts and unfinished or legacy documents).
  var LIVE = '_type=="product" && !(_id in path("drafts.**")) && defined(slug.current) && defined(image.asset) && category in ["Chandelier","Pendant","Wall light","Table lamp","Floor lamp","Outdoor"]';
  var CARD = '{_id, name, "slug": slug.current, category, availability, material, price, featured, "img": image.asset->url}';

  function card(p) {
    return {
      cat: p.category, name: p.name, mat: p.material || '', lt: p.availability, lc: LABEL[p.availability] || 'lb-show',
      price: price(p.price), img: img(p.img, 900), href: 'product.html?slug=' + encodeURIComponent(p.slug),
      featured: !!p.featured, slug: p.slug
    };
  }

  window.Sanity = {
    price: price, egp: egp, img: img, labelClass: function (a) { return LABEL[a] || 'lb-show'; },
    products: function () {
      return query('*[' + LIVE + '] | order(order asc, name asc)' + CARD).then(function (r) { return r.map(card); });
    },
    product: function (slug) {
      return query('*[' + LIVE + ' && slug.current==$slug][0]{_id, name, "slug": slug.current, category, availability, material, price, reference, description,' +
        ' "img": image.asset->url, "gallery": gallery[].asset->url, sizes, specs}', { slug: slug });
    },
    related: function (slug, category) {
      return query('*[' + LIVE + ' && slug.current!=$slug] | order(select(category==$cat => 0, 1) asc, order asc)[0..3]' + CARD, { slug: slug, cat: category })
        .then(function (r) { return r.map(card); });
    }
  };
})();
