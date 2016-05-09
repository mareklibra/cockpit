SRCDIR=pkg/vms
vmsdir = $(pkgdatadir)/vms


vms_MODULES = \
	$(SRCDIR)/_index.js \
	$(SRCDIR)/index.js \
	$(SRCDIR)/store.js \
	$(SRCDIR)/actions.js \
	$(SRCDIR)/reducers.js \
	$(SRCDIR)/middlewares.js \
	$(SRCDIR)/machined.js \
	$(SRCDIR)/app.js \
	$(SRCDIR)/hostvmslist.js \
	$(NULL)

vmsimagesdir = $(vmsdir)/images
vmsimages_DATA = \
        $(SRCDIR)/images/vm_shutdown.png \
        $(NULL)

vms_TESTS = \
	$(NULL)

# Typically only modify stuff above this line

nodist_vms_DATA = \
	$(SRCDIR)/index.min.html.gz \
	$(SRCDIR)/bundle.min.js.gz \
	$(SRCDIR)/app.min.css.gz \
	$(NULL)

vms_DATA = \
	$(SRCDIR)/manifest.json \
	$(NULL)

vmsdebugdir = $(debugdir)$(vmsdir)
vmsdebug_DATA = \
	$(SRCDIR)/index.html \
	$(SRCDIR)/app.css
	$(vms_DATA) \
	$(NULL)

CLEANFILES += \
	$(SRCDIR)/bundle.min.js \
	$(NULL)

EXTRA_DIST += \
	$(SRCDIR)/bundle.min.js \
	$(vms_DATA) \
	$(NULL)

vms_MIN = \
	$(vms_MODULES:.js=.min.js) \
	$(NULL)

vms_BUNDLE = $(vms_MIN)

# Everything else into a nice big bundle
$(SRCDIR)/bundle.min.js: $(vms_BUNDLE)
	$(AM_V_GEN) $(srcdir)/tools/missing $(srcdir)/tools/jsbundle $@ $^

TESTS += $(vms_TESTS)

CLEANFILES += \
	$(SRCDIR)/app.min.css \
	$(SRCDIR)/index.min.html \
	$(SRCDIR)/bundle.min.js \
	$(vms_MIN) \
	$(nodist_vms_DATA) \
	$(NULL)

EXTRA_DIST += \
	$(SRCDIR)/app.min.css \
	$(SRCDIR)/index.min.html \
	$(SRCDIR)/bundle.min.js \
	$(vms_BOWER) \
	$(vms_BUNDLE) \
	$(vms_MODULES) \
	$(vms_DATA) \
	$(vmsdebug_DATA) \
	$(vms_TESTS) \
	$(NULL)
