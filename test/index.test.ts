import Html2PDF from '../src/index';

describe('Html2PDF', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-element">
        <h1>Test Content</h1>
      </div>
    `;
  });

  it('should initialize correctly', () => {
    const plugin = new Html2PDF();
    expect(plugin).toBeInstanceOf(Html2PDF);
  });

  it('should throw error when element not found', async () => {
    const plugin = new Html2PDF();
    await expect(plugin.print({ elementId: 'non-existent' }))
      .rejects
      .toThrow();
  });
});