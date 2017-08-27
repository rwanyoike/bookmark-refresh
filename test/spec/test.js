/* global describe, it, assert */
/* global OPT_APPEND_DESC */
/* global cleanTextContent, getBookmarkNodes, extractPageTitle, extractPageDesc */

(() => {
  describe('Make sure app setting are available', () => {
    it('should assert OPT_APPEND_DESC exists', () => {
      assert(OPT_APPEND_DESC);
    });
  });

  describe('Cleanup HTML text content; spaces, etc', () => {
    it('should clean multiple spaces, newlines, padding', () => {
      const cleaned = cleanTextContent(' example         \n\n\n   site      ');
      assert.equal('example site', cleaned);
    });
  });

  describe('Extract and flatten bookmark nodes', () => {
    it('should return a flattened array node list', () => {
      const nodes = [
        { url: 'http://test1.site' },
        { children: [
          { url: 'http://test2.site' },
          { children: [
            { url: 'http://test3.site' },
            { children: [
              { url: 'http://test4.site' },
              { url: 'http://test5.site' },
            ] },
          ] },
        ] },
      ];
      assert.deepEqual([
        { url: 'http://test1.site' },
        { url: 'http://test2.site' },
        { url: 'http://test3.site' },
        { url: 'http://test4.site' },
        { url: 'http://test5.site' },
      ], getBookmarkNodes(nodes));
    });
  });

  describe('Extract website <title/> from a doc', () => {
    it('should return null on a doc without a title', () => {
      const docHtml = '<head><title> </title></head>';
      const doc = new DOMParser().parseFromString(docHtml, 'text/html');
      assert.equal(null, extractPageTitle(doc));
    });

    it('should return a cleaned title from a doc', () => {
      const docHtml = '<head><title> test site\n</title></head>';
      const doc = new DOMParser().parseFromString(docHtml, 'text/html');
      assert.equal('test site', extractPageTitle(doc));
    });
  });

  describe('Extract website description from a doc', () => {
    it('should return null on a doc without a description', () => {
      const docHtml = '<head><title>Test Site</title></head>';
      const doc = new DOMParser().parseFromString(docHtml, 'text/html');
      assert.equal(null, extractPageDesc(doc));
    });

    describe('extract descriptions in the right order', () => {
      it('should detect meta description', () => {
        const docHtml = `<head>
                           <meta name="twitter:description" content="twitter cards description">
                           <meta property="og:description" content="facebook open graph description">
                           <meta name="description" content="meta description">
                           <meta itemprop="description" content="google+ / schema.org description">
                         </head>`;
        const doc = new DOMParser().parseFromString(docHtml, 'text/html');
        assert.equal('meta description', extractPageDesc(doc));
      });

      it('should detect google+ / schema.org description', () => {
        const docHtml = `<head>
                           <meta name="twitter:description" content="twitter cards description">
                           <meta property="og:description" content="facebook open graph description">
                           <meta itemprop="description" content="google+ / schema.org description">
                         </head>`;
        const doc = new DOMParser().parseFromString(docHtml, 'text/html');
        assert.equal('google+ / schema.org description', extractPageDesc(doc));
      });

      it('should detect facebook open graph description', () => {
        const docHtml = `<head>
                           <meta name="twitter:description" content="twitter cards description">
                           <meta property="og:description" content="facebook open graph description">
                         </head>`;
        const doc = new DOMParser().parseFromString(docHtml, 'text/html');
        assert.equal('facebook open graph description', extractPageDesc(doc));
      });

      it('should detect twitter cards description', () => {
        const docHtml = `<head>
                           <meta name="twitter:description" content="twitter cards description">
                         </head>`;
        const doc = new DOMParser().parseFromString(docHtml, 'text/html');
        assert.equal('twitter cards description', extractPageDesc(doc));
      });
    });
  });
})();
