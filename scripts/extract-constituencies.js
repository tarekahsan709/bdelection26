

        ...(area.upazila_id && { upazila_id: area.upazila_id })
      }))
    });
  }
});

  .sort((a, b) => parseInt(a.id) - parseInt(b.id));

};

