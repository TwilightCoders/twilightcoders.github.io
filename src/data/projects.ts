// The curated portfolio. Every line of copy here is sourced from the project's
// README and code (see docs/research/ on the main branch); stars, downloads and
// versions are refreshed from GitHub and RubyGems at build time (src/lib/stats.ts),
// with the `fallback` numbers used only when those APIs are unreachable.

export type Area = 'postgres' | 'ruby' | 'infra' | 'editor' | 'showcase';
export type Status = 'active' | 'stable' | 'beta' | 'dormant' | 'archive' | 'private';

export interface Link {
  label: string;
  href: string;
}

export interface Snippet {
  lang: string;
  code: string;
  caption?: string;
}

export interface Media {
  src: string; // file name under src/assets/work/
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  name: string;
  area: Area;
  status: Status;
  tagline: string;
  /** GitHub full name, used for live stars and last push. */
  repo?: string;
  /** Published RubyGems name, used for live downloads and version. */
  gem?: string;
  language: string;
  since: number;
  /** Plain-text install line shown on the card and detail page. */
  install?: string;
  links: Link[];
  /** A short credit line when the project is not solely ours. */
  credit?: string;
  /** Detail page content; present only for featured projects. */
  featured?: {
    order: number;
    lede: string;
    body: string[];
    highlights: string[];
    snippets?: Snippet[];
    media?: Media[];
    note?: string;
  };
  fallback?: { stars?: number; downloads?: number; version?: string };
}

export const areas: { id: Area; name: string; blurb: string }[] = [
  {
    id: 'postgres',
    name: 'PostgreSQL & ActiveRecord',
    blurb: 'Extensions for the Rails layer that sits on the database: native table inheritance, planner-estimated counts, soft deletes and query framing.',
  },
  {
    id: 'ruby',
    name: 'Ruby libraries & tools',
    blurb: 'Frameworks for command-line and terminal apps, native extensions, and API clients built where no good one existed.',
  },
  {
    id: 'infra',
    name: 'Infrastructure & homelab',
    blurb: 'Terraform providers, CI runners and packaging for the machines we run ourselves.',
  },
  {
    id: 'editor',
    name: 'Editor tooling',
    blurb: 'VS Code extensions for finding your projects and living in the terminal.',
  },
  {
    id: 'showcase',
    name: 'Visualizations & games',
    blurb: 'Work that is meant to be looked at.',
  },
];

export const projects: Project[] = [
  // ─── PostgreSQL & ActiveRecord ────────────────────────────────────────────
  {
    slug: 'active-record-mti',
    name: 'ActiveRecord::MTI',
    area: 'postgres',
    status: 'active',
    tagline: 'Maps Rails model subclasses onto PostgreSQL’s native table inheritance.',
    repo: 'TwilightCoders/active_record-mti',
    gem: 'active_record-mti',
    language: 'Ruby',
    since: 2016,
    install: 'gem "active_record-mti", github: "TwilightCoders/active_record-mti"',
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/active_record-mti' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/active_record-mti' },
    ],
    featured: {
      order: 1,
      lede: 'Single-table inheritance puts every subclass in one wide table. ActiveRecord::MTI gives each subclass its own table, using the inheritance PostgreSQL already has.',
      body: [
        'Each model in a hierarchy lives in a table created with INHERITS (parent). Querying through the parent returns rows from every child, and MTI reads the tableoid system column to instantiate the right Ruby subclass, so no discriminator column is needed.',
        'It adds an inherits: option to create_table that survives schema dumps, and MTI and STI can be mixed in one hierarchy. QuickCount counts through MTI hierarchies too.',
      ],
      highlights: [
        'No type column: the row’s own table decides its class',
        'inherits: in migrations, preserved in schema.rb',
        'Mix MTI and STI in one hierarchy',
        'The most-starred project in the org',
      ],
      snippets: [
        {
          lang: 'ruby',
          code: `create_table 'account/users', inherits: :accounts do |t|
  t.string :email
end

Account.all
# => [#<User ...>, #<Admin ...>, #<Developer ...>]`,
        },
      ],
      note: 'The repository is at 0.5.0 with Rails 5.2 through 8.1 support; the newest RubyGems release is older, so install from git for current Rails.',
    },
    fallback: { stars: 97, downloads: 54116, version: '0.3.2' },
  },
  {
    slug: 'quick-count',
    name: 'QuickCount',
    area: 'postgres',
    status: 'active',
    tagline: 'Near-exact row counts for very large tables, in milliseconds instead of minutes.',
    repo: 'TwilightCoders/quick_count',
    gem: 'quick_count',
    language: 'Ruby',
    since: 2017,
    install: 'gem "quick_count"',
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/quick_count' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/quick_count' },
    ],
    featured: {
      order: 2,
      lede: 'SELECT COUNT(*) on a table with hundreds of millions of rows is a full scan. The database planner already knows roughly how many rows there are.',
      body: [
        'QuickCount adds Model.quick_count, which reads the planner’s row estimate and falls back to an exact count when the estimate is under a threshold (500,000 by default), so small tables stay exact and huge ones stay fast.',
        'In the production numbers the README reports, a 455-million-row table counts in 0.046 seconds at 99.8% accuracy, against 310 seconds for an exact count. It supports PostgreSQL, including active_record-mti hierarchies, and MySQL, and can estimate arbitrary relations with count_estimate.',
      ],
      highlights: [
        '455M rows: 0.046 s estimated vs 310 s exact',
        'Exact below a configurable threshold',
        'count_estimate for filtered relations',
        'PostgreSQL and MySQL',
      ],
      snippets: [
        {
          lang: 'ruby',
          code: `User.quick_count
User.quick_count(threshold: 1_000_000)
User.where(active: true).count_estimate`,
        },
      ],
    },
    fallback: { stars: 15, downloads: 28756 },
  },
  {
    slug: 'active-record-framing',
    name: 'ActiveRecord::Framing',
    area: 'postgres',
    status: 'dormant',
    tagline: 'Scope-like filters applied as a common table expression instead of a WHERE clause.',
    repo: 'TwilightCoders/active_record-framing',
    gem: 'active_record-framing',
    language: 'Ruby',
    since: 2019,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/active_record-framing' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/active_record-framing' },
    ],
    fallback: { stars: 2, downloads: 22315 },
  },
  {
    slug: 'deleted-at',
    name: 'DeletedAt',
    area: 'postgres',
    status: 'dormant',
    tagline: 'Soft deletes that hide rows by timestamp without a default_scope.',
    repo: 'TwilightCoders/deleted_at',
    gem: 'deleted_at',
    language: 'Ruby',
    since: 2014,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/deleted_at' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/deleted_at' },
    ],
    fallback: { stars: 4, downloads: 58254 },
  },
  {
    slug: 'doppel',
    name: 'Doppel',
    area: 'postgres',
    status: 'dormant',
    tagline: 'Finds near-duplicate records by Levenshtein distance using PostgreSQL’s fuzzystrmatch.',
    repo: 'TwilightCoders/doppel',
    gem: 'doppel',
    language: 'Ruby',
    since: 2015,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/doppel' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/doppel' },
    ],
    fallback: { downloads: 5964 },
  },
  {
    slug: 'virtual-view',
    name: 'VirtualView',
    area: 'postgres',
    status: 'dormant',
    tagline: 'Backs a model with an Arel query defined in Ruby instead of a database table.',
    repo: 'TwilightCoders/virtual_view',
    gem: 'virtual_view',
    language: 'Ruby',
    since: 2018,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/virtual_view' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/virtual_view' },
    ],
    fallback: { downloads: 4392 },
  },
  {
    slug: 'data-tables-responder',
    name: 'DataTables Responder',
    area: 'postgres',
    status: 'dormant',
    tagline: 'Answers jQuery DataTables server-side requests from a Rails controller with render dt:.',
    repo: 'TwilightCoders/data_tables-responder',
    gem: 'data_tables-responder',
    language: 'Ruby',
    since: 2016,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/data_tables-responder' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/data_tables-responder' },
    ],
    fallback: { downloads: 31058 },
  },
  {
    slug: 'active-record-narcissus',
    name: 'ActiveRecord::Narcissus',
    area: 'postgres',
    status: 'dormant',
    tagline: 'Resolves has_many and :through associations to namespaced subclasses automatically.',
    repo: 'TwilightCoders/active_record-narcissus',
    gem: 'active_record-narcissus',
    language: 'Ruby',
    since: 2018,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/active_record-narcissus' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/active_record-narcissus' },
    ],
    fallback: { downloads: 3005 },
  },
  {
    slug: 'enumerate',
    name: 'Enumerate',
    area: 'postgres',
    status: 'archive',
    tagline: 'Enum attributes for ActiveRecord with predicates, bang setters and scopes, from before Rails had enums.',
    repo: 'TwilightCoders/enumerate',
    gem: 'enumerate',
    language: 'Ruby',
    since: 2013,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/enumerate' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/enumerate' },
    ],
    fallback: { downloads: 7746 },
  },

  // ─── Ruby libraries & tools ──────────────────────────────────────────────
  {
    slug: 'terminal-toolkit',
    name: 'Ergane & Potty',
    area: 'ruby',
    status: 'active',
    tagline: 'A command-line framework and a terminal-UI framework for Ruby, built to work together.',
    repo: 'TwilightCoders/ergane',
    gem: 'ergane',
    language: 'Ruby',
    since: 2023,
    install: 'gem "ergane"  ·  gem "potty"',
    links: [
      { label: 'Ergane source', href: 'https://github.com/TwilightCoders/ergane' },
      { label: 'Potty source', href: 'https://github.com/TwilightCoders/potty' },
      { label: 'Ergane on RubyGems', href: 'https://rubygems.org/gems/ergane' },
      { label: 'Potty on RubyGems', href: 'https://rubygems.org/gems/potty' },
    ],
    featured: {
      order: 6,
      lede: 'Two libraries for tools that live in the terminal: Ergane for the command tree, Potty for everything drawn on screen.',
      body: [
        'Ergane defines a CLI as an Ergane::Tool whose commands are declared as blocks or as Command subclasses; both build the same tree. It generates help, typed options and flags, positional arguments whose required-ness comes from the run method’s own signature, arbitrarily nested subcommands, and shared-option base commands.',
        'Potty builds terminal UIs from composable widgets (lists, forms, status bars, flash messages) with a view stack for navigation, a focus model, theming and tick-based animation. It renders full-screen through curses, or inline with ANSI output that stays in the normal terminal flow for spinners and ask/confirm/choose prompts.',
      ],
      highlights: [
        'Arguments inferred from method signatures',
        'Nested subcommands and shared options',
        'Full-screen curses or inline ANSI rendering',
        'Widgets, focus, theming and animation',
      ],
      snippets: [
        {
          lang: 'ruby',
          caption: 'Ergane',
          code: `class MyCLI < Ergane::Tool
  tool_name :mycli
  version "1.0.0"

  command :greet do
    option :name, String, short: :n, default: "world"
    run { puts "Hello #{options[:name]}!" }
  end
end

MyCLI.start(ARGV)`,
        },
        {
          lang: 'ruby',
          caption: 'Potty',
          code: `class HelloView < Potty::View
  def build_layout
    @list = Potty::Widgets::List.new(app)
    @list.items = [Potty::Widgets::ActionItem.new('Quit') { app.quit }]
    @widgets = [@list]
    @list.focus
  end
end

app = Potty::Application.new
app.run(HelloView.new(app))`,
        },
      ],
    },
    fallback: { downloads: 1680 },
  },
  {
    slug: 'mdai',
    name: 'mdai',
    area: 'ruby',
    status: 'active',
    tagline: 'Turns a video into one dense markdown brief that an AI agent can read.',
    repo: 'TwilightCoders/mdai',
    language: 'Ruby',
    since: 2026,
    links: [{ label: 'Source', href: 'https://github.com/TwilightCoders/mdai' }],
  },
  {
    slug: 'sudo',
    name: 'Ruby Sudo',
    area: 'ruby',
    status: 'stable',
    tagline: 'Runs selected Ruby method calls as root from an unprivileged process, through sudo.',
    repo: 'TwilightCoders/rubysu',
    gem: 'sudo',
    language: 'Ruby',
    since: 2010,
    credit: 'Created by Guido De Rosa; co-maintained here.',
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/rubysu' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/sudo' },
    ],
    fallback: { stars: 15, downloads: 52931 },
  },
  {
    slug: 'deprecate',
    name: 'Deprecate',
    area: 'ruby',
    status: 'stable',
    tagline: 'Marks methods deprecated in one line, with caller locations and a suggested replacement.',
    repo: 'TwilightCoders/deprecate',
    gem: 'deprecate',
    language: 'Ruby',
    since: 2025,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/deprecate' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/deprecate' },
    ],
    fallback: { downloads: 39115 },
  },
  {
    slug: 'registry',
    name: 'Registry',
    area: 'ruby',
    status: 'active',
    tagline: 'An indexed in-memory collection that re-indexes objects when their attributes change.',
    repo: 'TwilightCoders/active_registry',
    gem: 'registry',
    language: 'Ruby',
    since: 2018,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/active_registry' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/registry' },
    ],
    fallback: { downloads: 17721 },
  },
  {
    slug: 'fastpbkdf2',
    name: 'ruby-fastpbkdf2',
    area: 'ruby',
    status: 'stable',
    tagline: 'PBKDF2 key derivation as a C extension, about 1.4–1.8× faster than OpenSSL from Ruby.',
    repo: 'TwilightCoders/ruby-fastpbkdf2',
    gem: 'ruby-fastpbkdf2',
    language: 'C',
    since: 2025,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/ruby-fastpbkdf2' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/ruby-fastpbkdf2' },
    ],
    fallback: { downloads: 837 },
  },
  {
    slug: 'simpleble',
    name: 'SimpleBLE for Ruby',
    area: 'ruby',
    status: 'stable',
    tagline: 'Bluetooth Low Energy scanning, pairing and GATT reads and writes on macOS, Linux and Windows.',
    repo: 'TwilightCoders/ruby-simpleble',
    gem: 'simpleble',
    language: 'C',
    since: 2025,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/ruby-simpleble' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/simpleble' },
    ],
    fallback: { stars: 1, downloads: 655 },
  },
  {
    slug: 'alta-labs',
    name: 'AltaLabs',
    area: 'ruby',
    status: 'active',
    tagline: 'Ruby SDK for Alta Labs networking, reverse-engineered, with native Cognito SRP login.',
    repo: 'TwilightCoders/alta_labs',
    gem: 'alta_labs',
    language: 'Ruby',
    since: 2026,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/alta_labs' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/alta_labs' },
    ],
    fallback: { stars: 1, downloads: 947 },
  },
  {
    slug: 'pandoru',
    name: 'Pandoru',
    area: 'ruby',
    status: 'active',
    tagline: 'A Ruby port of pydora for Pandora’s unofficial API: stations, playlists and search.',
    repo: 'TwilightCoders/pandoru',
    gem: 'pandoru',
    language: 'Ruby',
    since: 2025,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/pandoru' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/pandoru' },
    ],
    fallback: { downloads: 634 },
  },
  {
    slug: 'jump-cloud',
    name: 'JumpCloud',
    area: 'ruby',
    status: 'dormant',
    tagline: 'Ruby client for the JumpCloud directory API and its host agent.',
    repo: 'TwilightCoders/jump_cloud',
    gem: 'jump_cloud',
    language: 'Ruby',
    since: 2018,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/jump_cloud' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/jump_cloud' },
    ],
    fallback: { downloads: 18974 },
  },
  {
    slug: 'erle',
    name: 'ERLE',
    area: 'ruby',
    status: 'dormant',
    tagline: 'Parses Erlang terms (tuples, atoms, binaries, pids) into Ruby data.',
    repo: 'TwilightCoders/erle',
    gem: 'erle',
    language: 'Ruby',
    since: 2018,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/erle' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/erle' },
    ],
    fallback: { downloads: 3252 },
  },

  // ─── Infrastructure & homelab ────────────────────────────────────────────
  {
    slug: 'terraform-providers',
    name: 'Terraform providers',
    area: 'infra',
    status: 'active',
    tagline: 'TrueNAS SCALE and Alta Labs routers, managed declaratively.',
    repo: 'TwilightCoders/terraform-provider-truenas',
    language: 'Go',
    since: 2026,
    links: [
      { label: 'TrueNAS source', href: 'https://github.com/TwilightCoders/terraform-provider-truenas' },
      { label: 'TrueNAS on the Registry', href: 'https://registry.terraform.io/providers/TwilightCoders/truenas/latest' },
      { label: 'Alta Labs source', href: 'https://github.com/TwilightCoders/terraform-provider-alta' },
    ],
    featured: {
      order: 4,
      lede: 'Two providers for the gear in our own rack, each built on an API that was never meant to be driven this way.',
      body: [
        'The TrueNAS provider brings TrueNAS SCALE 25.10+ under Terraform through its versioned JSON-RPC WebSocket API: datasets, shares, snapshot and replication tasks, users, VMs, apps, iSCSI, certificates and system settings, over 40 resources, each with a matching data source. Resources are short specs derived from TrueNAS’s own API schema and run through one generic engine. Secrets use write-only attributes so they never land in state, and a read_only mode makes it safe to plan against a production box.',
        'Alta Labs publishes no API, so the Alta provider writes VLANs, routes, port forwards, firewall rules, DHCP reservations and switch ports through the Alta cloud, keeping the vendor portal in sync with what Terraform applied. Every apply is one gated, commit-confirmed transaction: the router’s cloud agent is paused, a single push is released, and the router rolls itself back unless health probes pass.',
      ],
      highlights: [
        'TrueNAS: 40+ resources, write-only secrets, list/query import',
        'Terraform 1.14 actions: run a replication, scrub a pool, restart an app',
        'Alta: commit-confirmed applies with automatic rollback',
        'Alta’s observed API is recorded and re-checked against a live router',
      ],
      snippets: [
        {
          lang: 'hcl',
          caption: 'TrueNAS',
          code: `provider "truenas" {
  host     = "nas.lan"
  username = "truenas_admin"
  # api_key from TRUENAS_API_KEY
}

resource "truenas_snapshot_task" "home" {
  dataset        = "tank/home"
  recursive      = true
  lifetime_value = 14
  lifetime_unit  = "DAY"
  schedule = {
    minute = "45"
    hour   = "2"
  }
}`,
        },
        {
          lang: 'hcl',
          caption: 'Alta Labs',
          code: `resource "alta_vlan" "lab" {
  vlan_id   = 40
  name      = "Lab"
  router_ip = "198.18.40.1/24"
}

resource "alta_dhcp_reservation" "printer" {
  mac = "02:00:00:aa:bb:cc"
  ip  = cidrhost(alta_vlan.lab.subnet, 40)
}`,
        },
      ],
      note: 'Both are pre-1.0. The TrueNAS provider is published on the Terraform Registry; the Alta provider is installed from source for now. Alta support is unofficial and unaffiliated with Alta Labs.',
    },
  },
  {
    slug: 'gh-run-club',
    name: 'gh-run-club',
    area: 'infra',
    status: 'stable',
    tagline: 'Many repo-scoped GitHub Actions runners in one container, for Free orgs and homelabs.',
    repo: 'TwilightCoders/gh-run-club',
    language: 'Shell',
    since: 2026,
    install: 'ghcr.io/twilightcoders/gh-run-club',
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/gh-run-club' },
      { label: 'Container image', href: 'https://github.com/TwilightCoders/gh-run-club/pkgs/container/gh-run-club' },
    ],
    fallback: { stars: 2 },
  },
  {
    slug: 'cads',
    name: 'CADS',
    area: 'infra',
    status: 'dormant',
    tagline: 'Reverse-engineers unknown packet checksums by brute force, at about 30 million tests a second.',
    repo: 'TwilightCoders/cads',
    language: 'C',
    since: 2025,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/cads' },
      { label: 'Syntax extension', href: 'https://marketplace.visualstudio.com/items?itemName=TwilightCoders.cads-syntax' },
    ],
  },
  {
    slug: 'iocage-fail2ban',
    name: 'Fail2Ban for iocage',
    area: 'infra',
    status: 'archive',
    tagline: 'Fail2Ban packaged as a FreeNAS iocage plugin, banning SSH brute-forcers from a jail.',
    repo: 'TwilightCoders/iocage-plugin-fail2ban',
    language: 'Shell',
    since: 2019,
    links: [{ label: 'Source', href: 'https://github.com/TwilightCoders/iocage-plugin-fail2ban' }],
    fallback: { stars: 5 },
  },
  {
    slug: 'freenas-rails',
    name: 'FreeNAS Rails Setup',
    area: 'infra',
    status: 'archive',
    tagline: 'A 2014 walkthrough for hosting Rails behind nginx and Unicorn in a FreeNAS jail.',
    repo: 'TwilightCoders/FreeNAS-Rails-Setup',
    language: 'Ruby',
    since: 2014,
    links: [{ label: 'Source', href: 'https://github.com/TwilightCoders/FreeNAS-Rails-Setup' }],
    fallback: { stars: 5 },
  },

  // ─── Editor tooling ──────────────────────────────────────────────────────
  {
    slug: 'codeshelf',
    name: 'CodeShelf',
    area: 'editor',
    status: 'active',
    tagline: 'Every project on your machine as a browsable, searchable library inside VS Code.',
    repo: 'TwilightCoders/codeshelf',
    language: 'TypeScript',
    since: 2026,
    install: 'ext install TwilightCoders.shelf',
    links: [
      { label: 'VS Code Marketplace', href: 'https://marketplace.visualstudio.com/items?itemName=TwilightCoders.shelf' },
      { label: 'Source', href: 'https://github.com/TwilightCoders/codeshelf' },
    ],
    featured: {
      order: 3,
      lede: 'A Steam-library-style view of every project you have ever built, one window away.',
      body: [
        'Point CodeShelf at the folders your code lives in and it builds a library of project cards showing language, branch, last-touched time and keyword tags. Projects are discovered by git repository boundary, so monorepos and nested groups need no configuration, and worktrees stack onto their parent project.',
        'Tags come from TF-IDF across the whole library, search covers README and source vocabulary, and the library can be browsed as shelves, as a workbench of recent work, or as a timeline by age. All scanning stays on your machine.',
      ],
      highlights: [
        'Shelves, workbench and timeline views',
        'Automatic tags from TF-IDF over your own code',
        'Search by README and source vocabulary',
        'Local only: nothing leaves the machine',
      ],
      media: [
        { src: 'codeshelf-shelves.png', alt: 'CodeShelf shelves view: project cards grouped into shelves with language and branch', caption: 'Shelves' },
        { src: 'codeshelf-workbench.png', alt: 'CodeShelf workbench view listing recently touched projects', caption: 'Workbench' },
        { src: 'codeshelf-timeline.png', alt: 'CodeShelf timeline view arranging projects by age', caption: 'Timeline' },
      ],
    },
  },
  {
    slug: 'alterminal',
    name: 'Alterminal',
    area: 'editor',
    status: 'active',
    tagline: 'A VS Code terminal with tabs that survive restarts, saved commands and cross-window alerts.',
    repo: 'TwilightCoders/vscode-alterminal',
    language: 'TypeScript',
    since: 2025,
    install: 'VSIX from GitHub releases',
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/vscode-alterminal' },
      { label: 'Releases', href: 'https://github.com/TwilightCoders/vscode-alterminal/releases' },
    ],
  },

  // ─── Visualizations & games ──────────────────────────────────────────────
  {
    slug: 'monopolia',
    name: 'Monopolia',
    area: 'showcase',
    status: 'stable',
    tagline: 'Watch thirteen U.S. industries consolidate through mergers, from 1990 to today.',
    repo: 'TwilightCoders/monopolia',
    language: 'TypeScript',
    since: 2026,
    links: [
      { label: 'Open Monopolia', href: 'https://twilightcoders.net/monopolia/' },
      { label: 'Source', href: 'https://github.com/TwilightCoders/monopolia' },
    ],
    featured: {
      order: 5,
      lede: 'Scrub a slider through thirty-four years and watch each company’s market share line fold into its acquirer on the day the merger closed.',
      body: [
        'Monopolia covers thirteen industries, including airlines, banking, telecom, pharmaceuticals, grocery, beer, defense and railroads, with switchable metrics and a concentration overlay (CR4 and CR8) that shows how much of each market the largest firms hold.',
        'The front end is React, TypeScript and D3. A Python pipeline builds the airline data from the Bureau of Transportation Statistics T-100 filings; the other industries use curated datasets that cite their public sources.',
      ],
      highlights: [
        '13 industries, 1990 to 2024',
        'Mergers animate on their closing dates',
        'CR4 / CR8 concentration overlay',
        'Airline data built from BTS T-100 filings',
      ],
      media: [
        { src: 'monopolia.png', alt: 'Monopolia chart of U.S. airline market share from 1990 to 2024, with lines merging at each acquisition and events such as September 11 and the COVID-19 pandemic marked', caption: 'Airlines, 1990–2024' },
      ],
    },
  },

  // ─── Archive (shown in the catalog's archive group) ──────────────────────
  {
    slug: 'clockpicker-rails',
    name: 'clockpicker-rails',
    area: 'ruby',
    status: 'archive',
    tagline: 'The ClockPicker time picker, packaged for the Rails asset pipeline.',
    repo: 'TwilightCoders/clockpicker-rails',
    gem: 'clockpicker-rails',
    language: 'Ruby',
    since: 2015,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/clockpicker-rails' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/clockpicker-rails' },
    ],
    fallback: { downloads: 194099 },
  },
  {
    slug: 'foo-table-rails',
    name: 'foo_table-rails',
    area: 'ruby',
    status: 'archive',
    tagline: 'The FooTable responsive-table plugin, packaged for the Rails asset pipeline.',
    repo: 'TwilightCoders/foo_table-rails',
    gem: 'foo_table-rails',
    language: 'Ruby',
    since: 2014,
    links: [
      { label: 'Source', href: 'https://github.com/TwilightCoders/foo_table-rails' },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/foo_table-rails' },
    ],
    fallback: { stars: 1, downloads: 34368 },
  },
];

export interface Upcoming {
  name: string;
  kind: string;
  summary: string;
}

/** Work in progress: described briefly, without links, until it is ready. */
export const upcoming: Upcoming[] = [
  {
    name: 'ProgreSQL',
    kind: 'PostgreSQL · C',
    summary:
      'A PostgreSQL fork that adds indexes enforcing uniqueness across every partition of a table, and foreign keys that can point into any child of an inheritance tree. Its regression and recovery suites pass; it has not yet been run at scale.',
  },
  {
    name: 'Galaxer',
    kind: 'Game · C++',
    summary:
      'A real-time space-conquest game. Every planet you hold builds ships over time, and you send fleets to capture neutral and enemy planets until one player remains.',
  },
];

export interface Contribution {
  project: string;
  upstream: string;
  href: string;
  state: 'merged' | 'published' | 'open';
  year: number;
  summary: string;
}

export const contributions: Contribution[] = [
  {
    project: 'Him',
    upstream: 'remi/her',
    href: 'https://github.com/TwilightCoders/him',
    state: 'published',
    year: 2026,
    summary: 'A continuation of the Her REST-resource ORM for Ruby 3.1+, Rails 6.1+ and Faraday 2, with JSON:API compound documents and about twenty association and dirty-tracking fixes. Published as the him gem; the same changes are offered upstream as remi/her#554.',
  },
  {
    project: 'flock',
    upstream: 'discoteq/flock',
    href: 'https://github.com/discoteq/flock/pull/43',
    state: 'merged',
    year: 2026,
    summary: 'CI, bug fixes, a comprehensive test suite and a refactor for the portable flock(1) implementation.',
  },
  {
    project: 'xterm-link-provider',
    upstream: 'LabhanshAgrawal/xterm-link-provider',
    href: 'https://github.com/LabhanshAgrawal/xterm-link-provider/pull/40',
    state: 'merged',
    year: 2026,
    summary: 'Moved the link provider to @xterm/xterm 6.0. A follow-up fixing link-position drift is open as #41.',
  },
  {
    project: 'workflow',
    upstream: 'geekq/workflow',
    href: 'https://github.com/geekq/workflow/pull/209',
    state: 'merged',
    year: 2019,
    summary: 'Negative class- and instance-level scopes (#112, 2014), then a modernization with CI across Ruby 2.3–2.5 and ActiveRecord 4.1–5.2 (#209, 2019).',
  },
];

export const featured = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.featured!.order - b.featured!.order);
